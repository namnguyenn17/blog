import { Container } from 'layouts/Container';
import Link from 'next/link';

const workExperience = [
  {
    company: 'DoB Tech',
    title: 'Full-Stack Software Engineer',
    duration: '2023 - Present'
  },
  {
    company: 'Simpson Strong-Tie',
    title: 'Intern Software Engineer',
    duration: 'Jul - Oct 2023'
  }
];

export default function About() {
  return (
    <Container>
      <h1>About Me</h1>
      <p>
        I’m Nam, a full-stack engineer, creative coder and self-proclaimed
        designer who has a passion for the front-end spectrum. I love creating,
        whether those things are web applications.
      </p>
      <p>
        I specialize in front-end development and make it my mission to
        translate user-focussed designs into pixel-perfect websites or
        applications that run blazing fast.
      </p>
      <p>
        I always like learning new things. I often write about my findings on my{' '}
        <Link href="/blog" legacyBehavior>
          <a>blog</a>
        </Link>
        , and post helpful tech-related tidbits on{' '}
        <a href="https://twitter.com/namnguyenn17">Twitter</a>.
      </p>
      <div className="grid items-start grid-cols-1 md:grid-cols-12 mt-12 space-y-6 md:space-y-0">
        <p className="col-span-2 m-0 text-2xl md:text-xl font-semibold text-gray-900 dark:text-white">
          Work experience
        </p>
        <div className="col-span-10 space-y-2">
          {workExperience.map((workItem) => (
            <div
              key={workItem.company}
              className="flex items-center space-x-8 group"
            >
              <span className="flex-none gover-hover:underline text-gray-900 dark:text-gray-400">
                {workItem.company}
              </span>
              <span className="flex-shrink w-full border-t border-gray-300 border-dashed dark:border-gray-700"></span>
              <span className="flex-none text-gray-400 dark:text-gray-600">
                {workItem.title}
              </span>
              <span className="flex-none text-gray-400 dark:text-gray-600">
                {workItem.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
