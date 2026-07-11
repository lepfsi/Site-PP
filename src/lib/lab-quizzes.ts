/** Keyword groups per question: each inner array is OR; all groups must match (AND). */
export interface LabQuizQuestion {
  keywords: string[][];
}

export interface LabQuizConfig {
  questions: LabQuizQuestion[];
}

function quizKey(pathSlug: string, stepId: string): string {
  return `${pathSlug}:${stepId}`;
}

export const LAB_QUIZ_CONFIGS: Record<string, LabQuizConfig> = {
  [quizKey("soc-first-30-days", "s6")]: {
    questions: [
      { keywords: [["triage"], ["scope", "scoping"], ["preserv", "evidence"], ["contain"]] },
      {
        keywords: [
          ["isolat", "isolate", "host", "edr", "network"],
          ["account", "compte", "disable", "désactiv", "credential", "identit"],
        ],
      },
      { keywords: [["lateral"], ["movement", "mouvement", "kerberos", "impossible", "siem"]] },
      { keywords: [["genai", "llm", "chatgpt", "ia gén", "generative"], ["dlp", "leak", "fuite", "sensitive", "sensib"]] },
    ],
  },
  [quizKey("noc-network-foundations", "s6")]: {
    questions: [
      { keywords: [["mtu"], ["mismatch", "differ", "exstart", "init", "adjacen"]] },
      { keywords: [["native vlan", "native"], ["mismatch", "untag", "danger", "one-way", "unidirection"]] },
      { keywords: [["communit"], ["local-pref", "local pref", "path", "upstream", "routing"]] },
      { keywords: [["ping"], ["mtr"], ["traceroute"], ["trace"], ["packet", "paquet", "loss", "perte"]] },
    ],
  },
  [quizKey("cloud-ops-production", "s6")]: {
    questions: [
      {
        keywords: [
          ["irsa", "node group", "nodegroup", "control plane", "control-plane"],
          ["upgrade", "logging", "audit", "network policy", "endpoint"],
        ],
      },
      { keywords: [["default-deny", "default deny", "deny"], ["isolat", "segment", "namespace", "block"]] },
      { keywords: [["red"], ["use"], ["rate", "error", "duration", "utilization", "saturation"]] },
      { keywords: [["state"], ["environment", "environnement", "backend", "isolat", "separate", "sépar"]] },
    ],
  },
};

export function getLabQuizConfig(pathSlug: string, stepId: string): LabQuizConfig | null {
  return LAB_QUIZ_CONFIGS[quizKey(pathSlug, stepId)] ?? null;
}

function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "'")
    .trim();
}

export function validateQuizAnswer(userInput: string, question: LabQuizQuestion): boolean {
  const norm = normalizeAnswer(userInput);
  if (!norm) return false;

  return question.keywords.every((group) =>
    group.some((keyword) => norm.includes(normalizeAnswer(keyword)))
  );
}

export function validateLabQuiz(
  pathSlug: string,
  stepId: string,
  answers: string[]
): { passed: boolean; failedIndex: number | null } {
  const config = getLabQuizConfig(pathSlug, stepId);
  if (!config) return { passed: false, failedIndex: 0 };

  if (answers.length !== config.questions.length) {
    return { passed: false, failedIndex: answers.length === 0 ? 0 : answers.length };
  }

  for (let i = 0; i < config.questions.length; i++) {
    if (!validateQuizAnswer(answers[i] ?? "", config.questions[i])) {
      return { passed: false, failedIndex: i };
    }
  }

  return { passed: true, failedIndex: null };
}