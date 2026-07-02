---
title: 'The best CLI is one you never run'
description: 'What the Astryx CLI is, why it is docs-first, and a tour of every command.'
date: '2026-07-02'
type: 'engineering'
authors:
  - 'joeyfarina'
tags:
  - 'CLI'
  - 'AI'
  - 'Docs'
draft: true
relatedDocs:
  - title: 'How Astryx works'
    href: '/blog/how-astryx-works'
  - title: 'CLI'
    href: '/docs/cli'
---

This is the first in a series on the Astryx CLI. It is the tool an agent uses to build with Astryx, and it is a piece we put a lot of thought and effort into getting right.

## The CLI is the docs

Agents live in the terminal now. Give one a good tool and it uses it well, but most tools we hand agents are not good enough for them. So we made a call that the CLI is the docs, where every doc, example, and reference starts. The docs site you are reading is a consumer of the CLI, not the other way around. The CLI is the source of truth. That means an agent always reads the exact source we wrote and maintain. There is no second copy to fall out of sync, and nothing goes stale.

Docs are only part of it. The CLI also serves templates that show an agent how to build a real page, it builds themes, and it searches across all of it. The best CLI is one you never run. The agent runs it. It is all open source, so [go look for yourself](https://github.com/facebook/astryx/blob/main/apps/docsite/scripts/generate-data.mjs). Or do not even read this post. Tell your agent to run `astryx blog` and it will read it for you.

## The tour

Here is every command, in the order you reach for it, from an empty folder to a shipped app.

**Set up.** `astryx init` installs the packages, sets up theming, and writes your agent file. You do not maintain that file, we do, and `upgrade` keeps it current as the system changes.

**Learn.** `astryx search` ranks results across components, hooks, docs, and templates at once. `astryx component` prints the props, examples, and source for a component, `astryx hook` does the same for hooks, and `astryx docs` covers the reference topics like tokens, color, type, motion, and our principles.

**Compose.** `astryx build` is the one to know. Tell it what you are making and it points the agent at the right path: the closest template, the blocks that cover parts of it, and the components to fill the gaps. `astryx template` drops a page template straight into your project.

**Make it yours.** `astryx theme build` compiles a theme to production CSS and JS, and `astryx swizzle` ejects a component's full source when you want to own it.

**Keep it current.** `astryx upgrade` runs codemods that migrate your code between versions and refreshes the agent docs while it does. `astryx doctor` finds problems and tells you the fix. `astryx gap-report` lets your agent file a gap straight to our GitHub, so if you want it to, you do not have to.

## One surface, many readers

Every command speaks JSON, with stable error codes an agent can branch on and a manifest that describes the whole tool in one call. It reads in dense mode when an agent wants fewer tokens, or in another language when a person does. One source, reshaped for whoever is asking.

## More to come

An agent building with Astryx should not have to guess. Everything is one command away. Next in the series we get into the part we are proudest of: docs that cannot go stale, and why building the CLI first is what makes that true.
