'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useActionState, useEffect, useRef } from 'react';

import {
  sendContactMessageAction,
  type ContactActionState,
} from '@/app/actions/contact';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fadeUp, pageContainer } from '@/lib/motion/variants';

const initialState: ContactActionState = {
  status: 'idle',
  message: '',
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className='text-sm text-destructive'>{message}</p>;
}

export default function ContactPageClient() {
  const formRef = useRef<HTMLFormElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;
  const [state, formAction, pending] = useActionState(
    sendContactMessageAction,
    initialState,
  );

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <main className='relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.1),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#f8fafc_100%)] text-slate-950'>
      <BackgroundPattern
        opacity={0.08}
        className='pointer-events-none absolute inset-0'
      />

      <section className='relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32'>
        <motion.div
          className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start'
          variants={motionEnabled ? pageContainer : undefined}
          initial={motionEnabled ? 'hidden' : false}
          animate={motionEnabled ? 'show' : undefined}>
          <motion.div
            variants={motionEnabled ? fadeUp : undefined}
            className='space-y-6'>
            <p className='inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800'>
              Contact Snap AI
            </p>

            <div className='space-y-4'>
              <h1 className='max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl'>
                Tell us what you need and we’ll route it to the right inbox.
              </h1>
              <p className='max-w-2xl text-lg leading-8 text-slate-600'>
                Questions about billing, features, or something else? Send a
                note and our team will respond by email.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'>
              {[
                ['Fast replies', 'We aim to answer within one business day.'],
                [
                  'Billing help',
                  'Use this form for plans, receipts, and account questions.',
                ],
                ['Feature ideas', 'Share feedback for the product roadmap.'],
              ].map(([title, description]) => (
                <Card
                  key={title}
                  className='border-border/70 bg-white/85 shadow-sm backdrop-blur-sm'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-base'>{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={motionEnabled ? fadeUp : undefined}>
            <Card className='border-border/70 bg-white/90 shadow-xl backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-2xl'>Send a message</CardTitle>
                <CardDescription>
                  The message goes directly to the admin inbox configured in
                  `.env`.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={formRef} action={formAction} className='space-y-5'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <label
                        htmlFor='name'
                        className='text-sm font-medium text-slate-900'>
                        Full name
                      </label>
                      <Input
                        id='name'
                        name='name'
                        placeholder='Alex Carter'
                        className='bg-slate-50'
                        required
                      />
                      <FieldError message={state.fields?.name?.[0]} />
                    </div>
                    <div className='space-y-2'>
                      <label
                        htmlFor='email'
                        className='text-sm font-medium text-slate-900'>
                        Email address
                      </label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='you@company.com'
                        className='bg-slate-50'
                        required
                      />
                      <FieldError message={state.fields?.email?.[0]} />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label
                      htmlFor='subject'
                      className='text-sm font-medium text-slate-900'>
                      Subject
                    </label>
                    <Input
                      id='subject'
                      name='subject'
                      placeholder='How can we help?'
                      className='bg-slate-50'
                      required
                    />
                    <FieldError message={state.fields?.subject?.[0]} />
                  </div>

                  <div className='space-y-2'>
                    <label
                      htmlFor='message'
                      className='text-sm font-medium text-slate-900'>
                      Message
                    </label>
                    <Textarea
                      id='message'
                      name='message'
                      rows={6}
                      placeholder='Tell us what you are trying to do and what would help most.'
                      className='bg-slate-50'
                      required
                    />
                    <FieldError message={state.fields?.message?.[0]} />
                  </div>

                  <div className='flex flex-col gap-3'>
                    <Button
                      type='submit'
                      className='w-full rounded-full'
                      disabled={pending}>
                      {pending ? 'Sending...' : 'Send message'}
                    </Button>

                    {state.status !== 'idle' ? (
                      <div
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                          state.status === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border-rose-200 bg-rose-50 text-rose-800'
                        }`}
                        aria-live='polite'>
                        {state.message}
                      </div>
                    ) : null}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
