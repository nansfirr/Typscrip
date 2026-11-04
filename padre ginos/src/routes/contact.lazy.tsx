import { useMutation } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import postContact from '../api/postContact';
import type { SubmitEvent } from 'react';

function getString(formData: FormData, key: string): string{
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export const Route = createLazyFileRoute('/contact')({
  component: ContactRoute,
})

function ContactRoute() {
  const mutation = useMutation({
    mutationFn: function (e: SubmitEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.target);
      return postContact(
        getString(formData, "name"),
        getString(formData, "email"),
        getString(formData, "message"),
      );
    },
  });

  return (
    <div className='contact'>
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3
          className="m-12.5 text-center font-pacifico text-[30px] font-normal text-secondary"
        >
          Sent!
        </h3>
      ):(
        <form className="flex flex-col items-center" onSubmit={mutation.mutate}>
          <input 
            className="my-3.75 w-125 rounded-[5px] border-2 border-border p-2 focus:border-primary disabled:bg-[#999]"
            name="name" 
            placeholder="Name" 
          />
          <input 
            className="my-3.75 w-125 rounded-[5px] border-2 border-border p-2 focus:border-primary disabled:bg-[#999]"
            name="email" 
            placeholder="Email" 
          />
          <textarea 
            className="my-3.75 min-h-50 w-125 rounded-[5px] border-2 border-border p-2 focus:border-primary"
            name="message" 
            placeholder="Message"
          ></textarea>
          <button className="inline-block cursor-pointer rounded-[5px] border border-primary bg-transparent px-3.75 py-1.25 font-pacifico text-[20px] text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-border disabled:opacity-50">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}