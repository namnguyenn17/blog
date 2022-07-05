import Link from "next/link";

const NOTION_BLOG_ID =
    process.env.NOTION_BLOG_ID || "d5783b10f6414a068e03259a76a4e0e2";

type PostStatus = "Published" | "Draft";
export type Post = {
    id: string;
    slug: string;
    title: string;
    date: string;
    status: PostStatus;
};

export const getAllPosts = async (): Promise<Post[]> => {
    return await fetch(
        `https://notion-api.splitbee.io/v1/table/${NOTION_BLOG_ID}`
    )
        .then((res) => res.json())
        .then((res) => res.filter((row: Post) => row.status === "Published"));
};

export async function getStaticProps() {
    const posts = await getAllPosts();
    return {
        props: {
            posts,
        },
    };
}

function HomePage({ posts }: { posts: Post[] }) {
    return (
        <div className="content">
            <h1>Posts</h1>
            <div>
                {posts.map((post) => (
                    <Link href="/blog/[slug]" as={`/blog/${post.slug}`}>
                        <a>
                            <b>{post.title}</b>
                            <div className="sub">posted on {post.date}</div>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
