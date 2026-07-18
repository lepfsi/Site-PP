---
title: "Conditional Access: When One Person Holds the Keys to Your Entire Company"
excerpt: "Why centralizing Conditional Access on a single person creates operational and security risks. Strategies to delegate and secure access."
---

## Context

Picture this scene.

It’s 9:47 AM on a Monday morning.
Your finance team can no longer access their reporting tool.
The sales team can’t open their CRM.
Even executives are getting authentication errors.

The cause?
A change made the day before to a **Conditional Access policy**. A small rule, added *« to enhance security »*. Except it blocks everyone.

And the only person who can understand what happened and fix it is **on vacation**, phone off, until Friday.

This scenario is not as rare as you might think.

---

## The Real Problem Behind Conditional Access

Conditional Access has become, in most Microsoft 365 environments, **the most critical security layer**. It decides who can access what, from which device, from which country, and at what time.

The issue is that in many organizations, this responsibility still rests on **a single person** (sometimes two). Not because the teams are bad, but because:

- The topic is perceived as complex;
- There’s a fear of *« breaking something »*;
- There’s no real documentation or governance process.

Result: rights and knowledge are concentrated in very few hands.

> ⚠️ **Warning**: Conditional Access is not just a *« security feature »*. It’s often the last line of defense before accessing the company’s strategic data.

---

## What Can Go Wrong (Real-World Example)

Let’s take a real case I’ve seen multiple times.

A mid-sized company had implemented Conditional Access quite strictly. Only the security manager (let’s call her Sophie) truly mastered the policies.

One Friday afternoon, Sophie falls ill. On Monday morning, an external consultant who regularly works with the company can no longer connect. He changed his phone over the weekend and no longer has his old device enrolled.

No one else knows how to add a temporary exception without weakening the entire policy.
The IT team spends **4 hours** searching, testing, and finally contacting Microsoft Support in an emergency.

Meanwhile, the consultant can’t work, and an important client meeting is postponed.

All because **one person** held the knowledge and rights over Conditional Access.

This is not an isolated case. It’s the kind of situation that happens when you don’t anticipate human dependency on a critical system.

---

## Why This Situation Is Dangerous

Having only one person able to touch Conditional Access creates several concrete risks:

| Risk | Impact |
|------|--------|
| **Operational** | In case of absence, departure, or issue, the company may find itself locked out. |
| **Human Error** | A poorly mastered modification can impact hundreds of users. |
| **Paradoxical Security** | By over-centralizing to *« better control »*, you create a point of fragility that can be exploited (pressure, error, or departure of the key person). |

> 🔴 **Important**: Security should never depend on a single person. This is one of the basic principles of resilience.

---

## How to Properly Delegate Conditional Access?

The solution is not to give rights to everyone. It’s about **structuring responsibility**.

Here are the practices that work well:

### 1. Create a Real Governance Process
Any significant change to Conditional Access must go through a clear process:
**Test → Review → Validation → Documentation.**

### 2. Train at Least 2-3 People
Even if not everyone has modification rights, multiple people should understand the overall workings of the policies and be able to intervene in an emergency.

### 3. Use the Right Delegation Tools
- Use the **most precise Entra ID roles** possible;
- Create **dedicated security groups**;
- Leverage *« report-only »* features to test changes without impact.

### 4. Document and Version
Treat your Conditional Access policies like code:
- Comment them;
- Explain the *« why »* behind each rule;
- Keep a **history of modifications**.

> 💡 **Tip**: Simple rule: No one should be irreplaceable on a topic that can block access to the entire company.

---

## Conclusion

Conditional Access is an extremely powerful tool. But like any powerful tool, it becomes dangerous when its mastery depends on a single person.

If today, in your organization, **only one or two people are truly comfortable with Conditional Access**, it’s probably time to take a closer look.

Not to *« give rights to everyone »*, but to **reduce risk** and gain operational peace of mind.
