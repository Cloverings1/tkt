"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Ticket } from "lucide-react"

const steps = [
  {
    question: "What's your name?",
    subtitle: "We'd like to know who we're speaking with.",
    field: "name",
    type: "text" as const,
    placeholder: "Jane Smith",
  },
  {
    question: "What's your work email?",
    subtitle: "We'll use this to follow up on your application.",
    field: "email",
    type: "email" as const,
    placeholder: "jane@company.com",
  },
  {
    question: "What company or team are you with?",
    subtitle: "Tell us a bit about your organization.",
    field: "company",
    type: "text" as const,
    placeholder: "Acme Corp",
  },
  {
    question: "How large is your support team?",
    subtitle: "This helps us understand your scale.",
    field: "teamSize",
    type: "select" as const,
    options: [
      "Just me",
      "2–5 people",
      "6–20 people",
      "21–50 people",
      "50+ people",
    ],
  },
  {
    question: "What are you hoping to solve with TKT?",
    subtitle: "A sentence or two is plenty. We're curious what brought you here.",
    field: "useCase",
    type: "textarea" as const,
    placeholder: "We need a better way to track and resolve customer issues across our engineering team...",
  },
]

export default function ApplyPage() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const step = steps[current]
  const isLast = current === steps.length - 1
  const value = answers[step?.field] || ""
  const canProceed = value.trim().length > 0

  function handleNext() {
    if (isLast) {
      setSubmitted(true)
    } else {
      setCurrent((prev) => prev + 1)
    }
  }

  function handleBack() {
    setCurrent((prev) => Math.max(0, prev - 1))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && canProceed && step.type !== "textarea") {
      e.preventDefault()
      handleNext()
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
            <Check className="h-6 w-6 text-violet-400" />
          </div>
          <h1 className="mb-3 text-2xl font-semibold tracking-tight">
            Application received
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            Thank you for your interest in the TKT Research Preview.
            Our team will review your application and determine if your
            organization is a good fit. We&apos;ll reach out within
            5 business days.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-md shadow-primary/25">
              <Ticket className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">TKT</span>
          </Link>
          <span className="font-mono text-xs text-zinc-600">
            {current + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-900">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500 ease-out"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {step.question}
          </h1>
          <p className="mb-8 text-sm text-zinc-400">{step.subtitle}</p>

          {step.type === "text" || step.type === "email" ? (
            <input
              type={step.type}
              value={value}
              onChange={(e) =>
                setAnswers({ ...answers, [step.field]: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder={step.placeholder}
              autoFocus
              className="w-full border-b-2 border-zinc-800 bg-transparent py-3 text-lg text-foreground outline-none transition-colors placeholder:text-zinc-700 focus:border-violet-500"
            />
          ) : step.type === "textarea" ? (
            <textarea
              value={value}
              onChange={(e) =>
                setAnswers({ ...answers, [step.field]: e.target.value })
              }
              placeholder={step.placeholder}
              autoFocus
              rows={3}
              className="w-full resize-none border-b-2 border-zinc-800 bg-transparent py-3 text-lg text-foreground outline-none transition-colors placeholder:text-zinc-700 focus:border-violet-500"
            />
          ) : step.type === "select" ? (
            <div className="space-y-2.5">
              {step.options?.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    setAnswers({ ...answers, [step.field]: option })
                  }
                  className={`flex w-full items-center rounded-xl border px-5 py-3.5 text-left text-sm transition-all ${
                    value === option
                      ? "border-violet-500/40 bg-violet-500/10 text-white"
                      : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/[0.1] hover:text-zinc-300"
                  }`}
                >
                  <span className="flex-1">{option}</span>
                  {value === option && (
                    <Check className="h-4 w-4 text-violet-400" />
                  )}
                </button>
              ))}
            </div>
          ) : null}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={current === 0}
              className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300 disabled:invisible"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-500 disabled:opacity-30 disabled:hover:bg-violet-600"
            >
              {isLast ? "Submit Application" : "Continue"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
