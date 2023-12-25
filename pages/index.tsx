import { Container } from 'layouts/Container';

export default function Home() {
  return (
    <Container>
      <h1>
        <span className="block text-base text-center text-orange-600 dark:text-pink-500 font-semibold tracking-wide uppercase">
          Introducing
        </span>
        <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          Nam Nguyen's Portfolio
        </span>
      </h1>
      <p className="mt-8 leading-8">
        Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At
        arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae
        feugiat egestas ac. Diam nulla orci at in viverra scelerisque eget.
        Eleifend egestas fringilla sapien.
      </p>
      <p>
        Now I'm just writing placeholder content to try out the different blocks
        available. How about <a href="#">a link</a>, <strong>bold text</strong>,{' '}
        <s>strikethrough text</s>,<i>italic text</i> and{' '}
        <code className="bg-indigo-50 dark:bg-indigo-900 py-0.5 px-2 rounded mx-1 inline-block align-middle tracking-tight text-base">
          code
        </code>
        ?
      </p>
    </Container>
  );
}
