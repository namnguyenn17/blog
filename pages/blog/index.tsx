import { convertToArticleList, getPublishedArticles } from '@/lib/notion';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';

import { ArticleList } from '@/components/ArticleList';
import { Container } from 'layouts/Container';
import { Tag } from '@/components/Tag';

export default function Blog({ articles, tags }) {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  const filteredArticles = articles
    .sort((a, b) => Number(new Date(b.publishedDate)))
    .filter((post) => {
      return (
        post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

  useEffect(() => {
    setSearchValue(selectedTag);
  }, [selectedTag]);

  return (
    <Container>
      <div>
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          placeholder={`Search ${articles.length} articles...`}
        />
      </div>

      <div className="space-y-12 min-h-screen">
        <h3>Discover articles by topic</h3>
        <ul className="flex items-center justify-start flex-wrap space-x-4 list-none !important">
          {tags &&
            tags.map((tag) => (
              <Tag key={tag} tag={tag} cb={() => setSelectedTag(tag)} />
            ))}
        </ul>
        <h2>Articles</h2>
        {!filteredArticles.length && <p>No articles found.</p>}
        <ArticleList articles={filteredArticles} />
      </div>
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await getPublishedArticles(process.env.BLOG_DATABASE_ID);
  const { articles, tags } = convertToArticleList(data);

  return {
    props: {
      articles,
      tags
    },
    revalidate: 30
  };
};
