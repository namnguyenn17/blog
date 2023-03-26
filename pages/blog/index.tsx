import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';

import { ArticleCard } from '@/components/ArticleCard';
import { Client } from '@notionhq/client';
import Head from 'next/head';

export default function Blog({ articles, tags }) {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');
  const [criteria, setCriteria] = useState([]);

  const filteredArticles = articles
    .sort((a, b) => Number(new Date(b.publishedDate)))
    .filter((post) => {
      return (
        post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        post.tags.includes(searchValue.toLowerCase())
      );
    });

  useEffect(() => {
    setSearchValue(selectedTag);
  }, [selectedTag]);

  return (
    <div className="min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <input
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder="Search articles"
          />
        </div>
        <h2>Tags</h2>
        <ul className="space-y-4 flex space-x-4">
          {tags &&
            tags.map((tag) => (
              <li key={tag}>
                <button onClick={() => setSelectedTag(tag)}>
                  <span>{tag}</span>
                </button>
              </li>
            ))}
        </ul>
        <h2>Articles</h2>
        <ul className="space-y-12">
          {!filteredArticles.length && <p>No articles found.</p>}
          {filteredArticles.map((article) => (
            <li key={article.title}>
              <ArticleCard article={article} />
            </li>
          ))}

          {/* {articles &&
            articles.map((article) => (
              <li key={article.title}>
                <ArticleCard article={article} />
              </li>
            ))} */}
        </ul>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let tags: string[] = [];
  const notion = new Client({
    auth: process.env.NOTION_SECRET
  });

  const data = await notion.databases.query({
    database_id: process.env.BLOG_DATABASE_ID,
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: '✅ Published'
          }
        },
        {
          property: 'Type',
          select: {
            equals: 'Personal'
          }
        }
      ]
    },
    sorts: [
      {
        property: 'Published',
        direction: 'descending'
      }
    ]
  });

  const articles = data.results.map((article: any) => {
    return {
      title: article.properties.Name.title[0].plain_text,
      tags: article.properties.tags.multi_select.map((tag) => {
        if (!tags.includes(tag.name)) {
          const newList = [...tags, tag.name];
          tags = newList;
        }
        return { name: tag.name, id: tag.id };
      }),
      coverImage:
        article.properties?.coverImage?.files[0]?.file?.url ||
        article.properties.coverImage?.files[0]?.external?.url ||
        'https://via.placeholder.com/600x400.png',
      publishedDate: article.properties.Published.date.start
    };
  });

  return {
    props: {
      articles,
      tags
    },
    revalidate: 30
  };
};
