import type { ComponentType } from "react";

import { CaseStudyTemplate } from "@/components/templates/case-study-template";
import { GuideTemplate } from "@/components/templates/guide-template";
import { HomeTemplate } from "@/components/templates/home-template";
import { HubTemplate } from "@/components/templates/hub-template";
import { NarrativeTemplate } from "@/components/templates/narrative-template";
import type { PageTemplateMap } from "@/content/types";

export const templateRegistry = {
  caseStudy: CaseStudyTemplate,
  guide: GuideTemplate,
  home: HomeTemplate,
  hub: HubTemplate,
  narrative: NarrativeTemplate,
} satisfies {
  [K in keyof PageTemplateMap]: ComponentType<{ page: PageTemplateMap[K] }>;
};
