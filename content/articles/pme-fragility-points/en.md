---
title: "The Real Fragility Points Many SMEs Still Underestimate"
excerpt: "Identifying hidden single points of failure in SME infrastructures: VPN tunnels, central equipment, cross-cutting services. Realistic methods to address them."
---

## Introduction

In most medium-sized infrastructures, we often talk about redundancy for the most visible elements: critical servers, main internet links, backups…

However, when we look closer, we very frequently find **single points of failure** that are not always identified as such.

These fragilities generally do not cause problems on a daily basis. They only become critical when an incident occurs… and it’s often at that moment that we realize we didn’t have a real plan B.

---

## Why Do These Fragility Points Go Unnoticed?

Most SME infrastructures were not designed all at once. They have grown gradually.

At each step, a pragmatic solution that *« works for now »* is added.

> ℹ️ **Info**: The result is often an architecture that works well… **as long as no important element fails**.

Here are the situations I encounter most often in the field.

---

## 1. The Single (or Almost Single) VPN Tunnel

This is probably the most common case.

A company has multiple sites interconnected via Site-to-Site VPN tunnels. On paper, everything is redundant… but in reality, **a single tunnel** often carries most of the critical traffic.

> ⚠️ **Warning**: When this tunnel goes down, the consequences can be immediate: inability to access central applications, disruption of business flows, and sometimes even partial business shutdown.

---

## 2. The Central Equipment That Does "Too Much"

Many SMEs have one (or two) firewalls/routers that concentrate a large number of functions: routing, filtering, VPN, proxy, monitoring, authentication…

This equipment then becomes a **major single point of failure**.

> 🔴 **Important**: Its failure or saturation simultaneously impacts multiple critical services.

---

## 3. Poorly Redundant Cross-Cutting Services

Some services are used by the entire infrastructure but do not always have the same level of redundancy as business systems.

We are thinking in particular of: Active Directory, internal DNS, monitoring, centralized backups.

> ⚠️ **Caution**: When one of these services becomes unavailable, the consequences can be widespread and sometimes surprising.

---

## How to Objectively Identify Your Fragility Points?

The best way to proceed is to ask yourself a simple question:

> *If this element fails tomorrow morning, what concretely happens to the business?*

> 💡 **Tip**: Ask yourself these three questions:
> - Is there a real **operational** workaround solution?
> - Has this solution been **tested recently**?
> - Who would be impacted, and for how long?

---

## How to Realistically Address These Fragilities?

In most SMEs, there is no question of aiming for *« enterprise »* resilience. The goal is to identify the most important risks and provide **proportionate** responses.

> 📝 **Note**: The important thing is not to achieve perfection, but to significantly reduce the risk that *« everything stops at the same time »*.
