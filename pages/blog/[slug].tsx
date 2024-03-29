import { AnchorLink } from '@/components/AnchorLink';
import { ArticleList } from '@/components/ArticleList';
import { Callout } from '@/components/Callout';
import { CodeBlock } from '@/components/Codeblock';
import PageViews from '@/components/PageViews';
import Reactions from '@/components/Reactions';
import { Subscribe } from '@/components/Subscribe';
import { YoutubeEmbed } from '@/components/YoutubeEmbed';
import siteMetadata from '@/data/siteMetadata';
import generateSocialImage from '@/lib/generateSocialImage';
import { getArticlePublicUrl } from '@/lib/getArticlePublicUrl';
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard';
import {
  getArticlePage,
  getMoreArticlesToSuggest,
  getPublishedArticles
} from '@/lib/notion';
import { PageType } from '@/lib/types';
import { Client } from '@notionhq/client';
import { Container } from 'layouts/Container';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect } from 'react';
import { FacebookShareButton, LinkedinShareButton } from 'react-share';
import slugify from 'slugify';

export const Text = ({ text }) => {
  if (!text) {
    return null;
  }
  return text.map((value, index) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text
    } = value;
    return (
      <span
        key={index}
        className={[
          bold ? 'font-bold' : null,
          italic ? 'italic' : null,
          code
            ? 'bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-50 text-indigo-500 dark:text-indigo-200 py-0.5 px-2 rounded mx-1 inline-block align-middle tracking-tight text-base'
            : null,
          strikethrough ? 'line-through' : null,
          underline ? 'underline' : null
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text text={value.text} />
        </p>
      );
    case 'heading_1':
      return (
        <h1>
          <AnchorLink text={value.text[0].text.content}>
            <Text text={value.text} />
          </AnchorLink>
        </h1>
      );
    case 'heading_2':
      return (
        <h2>
          <AnchorLink text={value.text[0].text.content}>
            <Text text={value.text} />
          </AnchorLink>
        </h2>
      );
    case 'heading_3':
      return (
        <h3>
          <AnchorLink text={value.text[0].text.content}>
            <Text text={value.text} />
          </AnchorLink>
        </h3>
      );
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li>
          <Text text={value.text} />
        </li>
      );
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
            <Text text={value.text} />
          </label>
        </div>
      );
    case 'toggle':
      return (
        <details>
          <summary>
            <Text text={value.text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case 'child_page':
      return <p>{value.title}</p>;
    case 'image':
      const src =
        value.type === 'external' ? value.external.url : value.file.url;
      const caption =
        value.caption.length >= 1 ? value.caption[0].plain_text : '';
      return (
        <figure className="mt-0">
          <Image
            className="rounded-xl"
            objectFit="fill"
            width={1200}
            height={684}
            alt={
              caption
                ? caption
                : 'A visual depiction of what is being written about'
            }
            src={src}
          />
          {caption && (
            <figcaption className="text-center">{caption}</figcaption>
          )}
        </figure>
      );
    case 'code':
      return (
        <div>
          <CodeBlock
            language={value.language}
            code={value.text[0].text.content}
          />
        </div>
      );
    case 'callout':
      return (
        <Callout>
          {value.icon && <span>{value.icon.emoji}</span>}
          <div>
            <Text text={value.text} />
          </div>
        </Callout>
      );

    case 'embed':
      const codePenEmbedKey = value.url.slice(value.url.lastIndexOf('/') + 1);
      return (
        <div>
          <iframe
            height="600"
            className="w-full"
            scrolling="no"
            title="Postage from Bag End"
            src={`https://codepen.io/namnguyen-17/embed/preview/${codePenEmbedKey}?default-tab=result`}
            frameBorder="no"
            loading="lazy"
            allowFullScreen={true}
          >
            See the Pen <a href={value.url}>Postage from Bag End</a> by Nam
            Nguyen (
            <a href="https://codepen.io/namnguyennn17">@namnguyennn17</a>) on{' '}
            <a href="https://codepen.io">CodePen</a>.
          </iframe>
        </div>
      );

    case 'table_of_contents':
      return <div>TOC</div>;

    case 'video':
      const embedId = value.external.url.slice(
        value.external.url.lastIndexOf('=') + 1
      );
      return <YoutubeEmbed embedId={embedId} />;

    case 'quote':
      return (
        <blockquote className="p-4 rounded-r-lg">
          <Text text={value.text} />
        </blockquote>
      );
    case 'divider':
      return (
        <hr className="my-16 w-full border-none text-center h-10 before:content-['∿∿∿'] before:text-[#D1D5DB] before:text-2xl"></hr>
      );

    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
};

const ArticlePage = ({
  content,
  title,
  coverImage,
  slug,
  publishedDate,
  lastEditedAt,
  summary,
  moreArticles
}) => {
  const [isCopied, handleCopy] = useCopyToClipboard();
  const pubilcUrl = getArticlePublicUrl(slug);

  console.log('coverImage', coverImage);
  const publishedOn = new Date(publishedDate).toLocaleDateString(
    siteMetadata.locale,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const modifiedDate = new Date(lastEditedAt).toLocaleDateString(
    siteMetadata.locale,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const socialImageConf = generateSocialImage({
    title,
    underlayImage: coverImage.slice(coverImage.lastIndexOf('/') + 1),
    cloudName: 'namnguyen',
    imagePublicID: 'og_social_large.png'
  });

  console.log(socialImageConf);

  useEffect(() => {
    fetch(`/api/views/${slug}`, {
      method: 'POST'
    });
  }, [slug]);

  return (
    <Container
      title={`${title} - Nam Nguyen`}
      description={summary}
      imageUrl={socialImageConf}
      date={new Date(publishedDate).toISOString()}
      type={PageType.ARTICLE}
    >
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl md:text-5xl text-center">{title}</h1>
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 text-lg mb-2">
              <p className="m-0 text-lg md:text-xl">{publishedOn}</p>
              <p className="m-0">•</p>
              <PageViews slug={slug} />
            </div>
            {publishedOn !== modifiedDate && (
              <p className="text-sm md:text-base mt-0 text-gray-400 dark:text-gray-600">
                (Updated on {modifiedDate})
              </p>
            )}
          </div>
        </div>

        <div className="my-12">
          <Image
            className="rounded-xl"
            objectFit="fill"
            src={coverImage}
            width={1200}
            height={684}
            alt={'article cover'}
            priority
          />
        </div>

        {content.map((block) => (
          <Fragment key={block.id}>{renderBlock(block)}</Fragment>
        ))}
        <Reactions slug={slug} />
        <Subscribe />

        <div>
          <hr />
          <h3>More articles</h3>
          <p className="mb-12">
            If you enjoyed this article, you'll find these insightful too!
          </p>
          <ul>
            <ArticleList articles={moreArticles} />
          </ul>
        </div>
      </div>

      <FacebookShareButton title={title} url={pubilcUrl}>
        Share this article on Facebook
      </FacebookShareButton>
      <LinkedinShareButton title={title} url={pubilcUrl}>
        Share this article on Linkedin
      </LinkedinShareButton>
      <button onClick={() => handleCopy()}>Copy Article URL</button>

      <Link href="/blog">← Back to the blog</Link>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];
  const data: any = await getPublishedArticles(process.env.BLOG_DATABASE_ID);

  data.forEach((result) => {
    if (result.object === 'page') {
      paths.push({
        params: {
          slug: slugify(
            result.properties.Name.title[0].plain_text
          ).toLowerCase()
        }
      });
    }
  });

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  let content = [];
  let articleTitle = '';
  let publishedDate = null;
  let lastEditedAt = null;
  let coverImage = null;
  let summary = null;

  const notion = new Client({
    auth: process.env.NOTION_SECRET
  });

  const data: any = await getPublishedArticles(process.env.BLOG_DATABASE_ID);

  const page: any = getArticlePage(data, slug);

  articleTitle = page.properties.Name.title[0].plain_text;
  publishedDate = page.properties.Published.date.start;
  lastEditedAt = page.properties.LastEdited.last_edited_time;
  summary = page.properties.Summary.rich_text[0].plain_text;
  coverImage =
    page.properties?.coverImage?.files[0]?.file?.url ||
    page.properties.coverImage?.files[0]?.external?.url ||
    'https://via.placeholder.com/600x400.png';

  const moreArticles: any = await getMoreArticlesToSuggest(
    process.env.BLOG_DATABASE_ID,
    articleTitle
  );

  let blocks = await notion.blocks.children.list({
    block_id: page.id
  });

  content = [...blocks.results];

  while (blocks.has_more) {
    blocks = await notion.blocks.children.list({
      block_id: page.id,
      start_cursor: blocks.next_cursor
    });

    content = [...content, ...blocks.results];
  }

  return {
    props: {
      content,
      title: articleTitle,
      publishedDate,
      lastEditedAt,
      slug,
      moreArticles,
      summary,
      coverImage
    },
    revalidate: 30
  };
};

export default ArticlePage;
