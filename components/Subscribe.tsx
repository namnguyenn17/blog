import { Form, FormState, Subscribers } from '@/lib/types';
import React, { useRef, useState } from 'react';

import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { SuccessMessage } from './SuccessMessage';
import { fetcher } from '@/lib/fetcher';
import siteMetadata from '@/data/siteMetadata';
import { usePlausible } from 'next-plausible';
import useSWR from 'swr';
import { useSubscribeToNewsletter } from '@/lib/hooks/useSubscribeToNewsletter';

export function Subscribe() {
  const { form, subscribe, inputEl } = useSubscribeToNewsletter();
  const { data: subData } = useSWR<Subscribers>('/api/subscribers', fetcher);
  const subscriberCount = new Number(subData?.count);

  return (
    <div className="border border-gray-200 rounded-lg p-6 my-4 w-full dark:border-gray-700 bg-[#F8FAFC] dark:bg-midnight">
      <p className="textLg md:text-2xl mt-2 font-bold text-gray-900 dark:text-gray-100 flex items-center">
        Updates delivered to your inbox!
        <span>
          <svg
            className="w-6 h-6 md:w-7 md:h-7 ml-1"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17.25 12V10C17.25 7.1005 14.8995 4.75 12 4.75C9.10051 4.75 6.75 7.10051 6.75 10V12L4.75 16.25H19.25L17.25 12Z"
            ></path>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 16.75C9 16.75 9 19.25 12 19.25C15 19.25 15 16.75 15 16.75"
            ></path>
          </svg>
        </span>
      </p>

      <p className="mb-0">
        A periodic update about my life, recent blog posts, how-tos, and
        discoveries.
      </p>
      <p>No spam - unsubscribe at any time!</p>

      <form
        className="my-4 space-y-4 md:space-y-0 md:flex"
        onSubmit={subscribe}
      >
        <input
          ref={inputEl}
          placeholder="bobloblaw@gmail.com"
          type="email"
          autoComplete="email"
          required
          className="bg-white dark:bg-midnight py-3 md:py-4 px-8 mr-4 shadow-sm focus:ring-midnight dark:focus:ring-gray-100 block w-full sm:text-sm md:text-lg border-gray-300 dark:border-gray-400 rounded-full"
        />
        <button
          className="md:inline-flex w-full md:w-auto py-2 items-center justify-center px-6 font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full general-ring-state"
          type="submit"
        >
          {form.state === Form.Loading ? <LoadingSpinner /> : 'Subscribe'}
        </button>
      </form>
      {form.state === Form.Error ? (
        <ErrorMessage>{form.message}</ErrorMessage>
      ) : form.state === Form.Success ? (
        <SuccessMessage>{form.message}</SuccessMessage>
      ) : (
        <p className="text-sm mt-6">
          {`${
            Number(subscriberCount) > 0 ? subscriberCount.toLocaleString() : '-'
          } subscribers – `}
        </p>
      )}
    </div>
  );
}
