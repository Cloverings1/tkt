"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Ticket, Sparkles } from "lucide-react"

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
    placeholder:
      "We need a better way to track and resolve customer issues across our engineering team...",
  },
]

export default function ApplyPage() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const [animating, setAnimating] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const step = steps[current]
  const isLast = current === steps.length - 1
  const value = answers[step?.field] || ""
  const canProceed = value.trim().length > 0

  useEffect(() => {
    if (!submitted) {
      const timer = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(timer)
    }
  }, [current, submitted])

  function transition(dir: "forward" | "back", cb: () => void) {
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      cb()
      setAnimating(false)
    }, 200)
  }

  function handleNext() {
    if (isLast) {
      transition("forward", () => setSubmitted(true))
    } else {
      transition("forward", () => setCurrent((p) => p + 1))
    }
  }

  function handleBack() {
    transition("back", () => setCurrent((p) => Math.max(0, p - 1)))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && canProceed && step.type !== "textarea") {
      e.preventDefault()
      handleNext()
    }
  }

  const slideClass = animating
    ? direction === "forward"
      ? "translate-x-8 opacity-0"
      : "-translate-x-8 opacity-0"
    : "translate-x-0 opacity-100"

  if (submitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[150px]" />

        <div className="relative mx-auto max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Success icon */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 shadow-lg shadow-violet-500/10">
            <Sparkles className="h-7 w-7 text-violet-400" />
          </div>

          <h1 className="mb-4 text-3xl font-semibold tracking-tight">
            Application received
          </h1>

          <p className="mb-3 text-sm leading-relaxed text-zinc-400">
            Thank you for your interest in the TKT Research Preview.
          </p>
          <p className="mb-10 text-sm leading-relaxed text-zinc-500">
            We will review your application and determine if your organization
            is a good match for the program. Expect to hear from us within
            5 business days.
          </p>

          <div className="mb-10 rounded-xl border border-white/[0.04] bg-white/[0.02] px-6 py-4">
            <p className="text-xs text-zinc-600">
              Application submitted for
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-300">
              {answers.company || answers.name || "your organization"}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-violet-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-violet-500/[0.04] blur-[120px]" />

      {/* Header */}
      <div className="relative z-10 px-6 py-5">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/20">
              <Ticket className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">TKT</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Step dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= current
                      ? "w-1.5 bg-violet-400"
                      : "w-1.5 bg-zinc-800"
                  } ${i === current ? "w-5 bg-violet-500" : ""}`}
                />
              ))}
            </div>
            <span className="ml-2 font-mono text-xs text-zinc-700">
              {current + 1}/{steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-px bg-zinc-900/80">
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-violet-500 to-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div
          className={`w-full max-w-lg transition-all duration-300 ease-out ${slideClass}`}
          key={current}
        >
          {/* Step label */}
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-600">
            Step {current + 1}
          </p>

          <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {step.question}
          </h1>
          <p className="mb-10 text-sm text-zinc-500">{step.subtitle}</p>

          {step.type === "text" || step.type === "email" ? (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={step.type}
              value={value}
              onChange={(e) =>
                setAnswers({ ...answers, [step.field]: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder={step.placeholder}
              className="w-full border-b-2 border-zinc-800 bg-transparent py-3 text-lg text-foreground outline-none transition-all duration-300 placeholder:text-zinc-700 focus:border-violet-500 focus:shadow-[0_2px_12px_rgba(139,92,246,0.1)]"
            />
          ) : step.type === "textarea" ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={value}
              onChange={(e) =>
                setAnswers({ ...answers, [step.field]: e.target.value })
              }
              placeholder={step.placeholder}
              rows={3}
              className="w-full resize-none border-b-2 border-zinc-800 bg-transparent py-3 text-lg text-foreground outline-none transition-all duration-300 placeholder:text-zinc-700 focus:border-violet-500 focus:shadow-[0_2px_12px_rgba(139,92,246,0.1)]"
            />
          ) : step.type === "select" ? (
            <div className="space-y-2.5">
              {step.options?.map((option, i) => (
                <button
                  key={option}
                  onClick={() =>
                    setAnswers({ ...answers, [step.field]: option })
                  }
                  style={{ animationDelay: `${i * 50}ms` }}
                  className={`flex w-full items-center rounded-xl border px-5 py-4 text-left text-sm transition-all duration-200 ${
                    value === option
                      ? "border-violet-500/40 bg-violet-500/10 text-white shadow-lg shadow-violet-500/5"
                      : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-zinc-300"
                  }`}
                >
                  <span className="flex-1">{option}</span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200 ${
                      value === option
                        ? "border-violet-400 bg-violet-500"
                        : "border-zinc-700"
                    }`}
                  >
                    {value === option && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={current === 0}
              className="flex items-center gap-1.5 text-sm text-zinc-600 transition-all hover:gap-2.5 hover:text-zinc-300 disabled:pointer-events-none disabled:opacity-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/15 transition-all duration-200 hover:shadow-violet-500/25 hover:brightness-110 disabled:opacity-20 disabled:shadow-none disabled:hover:brightness-100"
            >
              {isLast ? "Submit Application" : "Continue"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-xs text-zinc-800">
          No account required &middot; Takes about 1 minute
        </p>
      </div>
    </div>
  )
}
