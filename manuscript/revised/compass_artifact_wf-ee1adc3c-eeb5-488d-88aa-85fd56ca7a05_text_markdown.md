# Novelty assessment: "How Abundance Always Creates Scarcity"

**The paper's central insight — that abundance structurally generates new scarcities — is not new, but its systematic formalization into a "scarcity channeling" mechanism, a three-part scarcity typology, and a business model compliance framework represents a genuine theoretical contribution.** The observation dates back to Herbert Simon in 1971 and was popularized as a business maxim by Chris Anderson in 2009, but no prior work has formalized the *mechanism* by which abundance converts to scarcity, categorized the resulting scarcity types, or connected this to business model evaluation criteria. The paper's strongest novelty lies in its governance infrastructure proposal and its business model analysis; its weakest originality lies in the foundational abundance-creates-scarcity claim itself.

---

## The core claim has a 55-year intellectual lineage

Herbert Simon wrote in 1971 that "a wealth of information creates a poverty of attention" — a structural argument linking abundance of one resource to scarcity of another. **Chris Anderson stated the general principle explicitly in 2009**: "Every abundance creates a new scarcity," which he described as "one of the oldest rules in economics" and operationalized as a business strategy maxim — give away the abundant thing, charge for the scarce complement. Lemley and Desai (2023) asked whether "the abundance of some things just create new forms of scarcity in others" but posed this as a research question rather than developing a theoretical framework. Madison, Frischmann, Sanfilippo, and Strandburg (2022) came closest to the paper's argument, writing that "the sources and impacts of information abundance are interwoven with the sources and impacts of resource scarcity, rather than independent of them," and explicitly challenging the assumption that "you can't have too much of a good thing."

What distinguishes the paper under review is the claim that this abundance-to-scarcity conversion is **structural and inevitable** — not contingent on poor governance or bad actors — and that organizational design changes *which* scarcity emerges, not *whether* scarcity arises. This fatalistic framing goes beyond Anderson's optimistic business advice and beyond Madison et al.'s governance-focused analysis. However, the paper must cite Anderson's exact formulation ("every abundance creates a new scarcity") and engage with Simon's foundational insight rather than presenting the observation as primarily its own.

---

## "Scarcity channeling" is novel terminology wrapping partially novel theory

The exact term **"scarcity channeling" appears nowhere in prior academic literature**. Searches for "channeled scarcity," "scarcity shifting," "scarcity transfer," and "scarcity displacement" yield no relevant theoretical frameworks. The metaphor of abundance being "channeled" into specific scarcity forms through identifiable mechanisms is a genuinely new conceptual contribution.

The **three-part typology** — artificial, dependency, and governance scarcity — is partially novel. "Artificial scarcity" is a well-established concept with deep roots: Michael Heller's "tragedy of the anticommons" (1998) described how fragmented exclusion rights cause underuse; James Boyle characterized intellectual property expansion as a "second enclosure movement"; David Bollier and others have extensively discussed artificial scarcity through DRM, paywalls, and licensing restrictions. The paper's contribution here is integrating this established concept into a broader framework rather than presenting a new insight.

"Dependency scarcity" — where firm subsidization creates lock-in (e.g., Google's Android) — connects to platform dependency and two-sided market literature but **has not been previously named or categorized as a distinct type of abundance-induced scarcity**. Michel Bauwens at the P2P Foundation noted "a delicate co-dependency between the communities, which need the capital and monetary income," which captures the dynamic without formalizing it. "Governance scarcity" — where community organization capacity becomes the bottleneck — finds strong empirical support in Schweik and English's *Internet Success* (2012), which demonstrated that governance and leadership capacity, not programming skill, determined open source project survival. **Their work essentially discovered governance scarcity empirically without naming or theorizing it as such.**

---

## The "governance trap" concept is novel but has close precursors

No prior work uses the exact term "governance trap" in the commons or open source context. However, the Atlantic Council published a 2023 report titled **"Avoiding the Success Trap: Toward Policy for Open-Source Software as Infrastructure"** — which explicitly frames the problem of open source appearing healthy on surface metrics while harboring structural vulnerabilities. This is conceptually very close to what the paper calls a "governance trap."

Halfaker et al.'s landmark 2013 study of Wikipedia editor decline provides the canonical empirical case. They documented how governance mechanisms that were designed to manage quality "ironically crippled the very growth they were designed to manage," and used the term **"calcification"** to describe how formal norms became rigid while readership continued growing. Wikipedia's readership rose even as its editor base declined by roughly half from 2007 peaks — a textbook instance of surface metrics masking governance erosion. Nadia Eghbal's *Working in Public* (2020) similarly described how GitHub stars and download counts mask maintainer exhaustion. The paper's contribution is naming and formalizing this pattern rather than discovering it.

---

## The ATARCA project is the most critical unaddressed prior work for business model analysis

The paper's business model contribution — analyzing 175 patterns, identifying 39 that manage abundance, grouping them into 7 mechanisms and 3 metamechanisms — faces its most direct prior art challenge from the **ATARCA (Accounting Technologies for Anti-Rival Coordination and Allocation)** project, an EU Horizon 2020 initiative (2021–2023) led by Aalto University. ATARCA published a 2022 report on "Anti-Rival Business Model Patterns" that created a toolkit with **20 business model patterns** categorized as either "compatible with" or "enabling" anti-rivalry.

The paper under review differs from ATARCA in important ways: it filters an existing comprehensive taxonomy rather than creating new patterns, it covers abundance-generating goods broadly rather than focusing on Web3 and data, and it introduces evaluative "abundance compliance" criteria. But the overlap is substantial enough that **failure to cite and differentiate from ATARCA would be a significant scholarly omission**, particularly given that both emerge from the anti-rival goods research community (Nikander et al.'s work on anti-rival compensation was part of ATARCA's intellectual foundation).

A technical note: the claim of "175 business model patterns from Gassmann et al." needs clarification. Gassmann's *Business Model Navigator* (2014) contains **exactly 55 patterns**. The 175 figure likely draws from Remané et al.'s (2017) "Business Model Pattern Database," which compiled **182 unique patterns** from 22 collections. The paper should specify its actual source.

The term **"abundance compliance" has no prior use** in academic literature. Paul Stacey's work for Creative Commons (2015–2017) explicitly framed business models as "abundance-based" versus "scarcity-based" and articulated principles like "maximize abundance, eliminate artificial scarcity," but never formalized these into compliance criteria or applied them systematically to a business model taxonomy.

---

## Governance infrastructure as public good is the paper's strongest novel contribution

Nadia Eghbal's *Roads and Bridges* (2016) established the foundational argument that digital infrastructure should be treated as a public good analogous to physical infrastructure. She wrote explicitly that "open source code is a public good" and that "no individual company or organization is incentivized to address the problem alone." However, Eghbal focused on **code maintenance and developer sustainability**, not on governance tools. Her 2020 book *Working in Public* refined this by arguing that maintainer attention — not money — is the scarce bottleneck, and that most projects function as "stadiums" (one-to-many) rather than collaborative communities. Neither work takes the specific step of identifying **governance infrastructure** (moderation tools, dispute resolution mechanisms, contribution tracking systems) as a distinct category of public good.

Existing government programs confirm this gap. Germany's **Sovereign Tech Fund** (2022, now Sovereign Tech Agency under SPRIND, ~€23.5M invested in 60+ projects) explicitly treats open source as "essential as roads or bridges" but funds code libraries, protocols, and security — **not governance tools specifically**. The proposed **EU Sovereign Tech Fund** (€350M for 2028–2035) follows the same pattern. France's digital commons initiatives, the EU's NGI Zero Commons Fund, and the **OpenSSF** (Open Source Security Foundation) all target code security and developer support, not governance infrastructure.

The closest existing precedent is the **Decidim** project — Barcelona's open-source digital democracy platform funded with public money — which is governance infrastructure supported by government. But Decidim serves democratic participation generally, not open source community governance. **No prior work proposes that moderation tools, dispute resolution platforms, and contribution tracking systems for digital commons are a distinct category of public good warranting government investment.** This appears to be the paper's most genuinely novel policy contribution.

---

## The coupled resource model synthesizes existing ideas without adding much new theory

The "coupled resource model" — abundance-generating resources paired with rival complements — has clear precursors. Anderson's entire thesis in *Free* (2009) is operationalized around this coupling: give away the abundant resource, monetize the scarce complement. Two-sided market theory (Rochet and Tirole 2003) formalizes pricing for platforms subsidizing one side to extract from another. Nikander et al. (2020) specifically argued that "data and many other information goods are anti-rival while our economy is centred around rival structures: private ownership and money," identifying a structural mismatch. The paper's contribution is synthesizing these into a unified model with a specific theoretical purpose (explaining scarcity channeling), but the constituent ideas are well-established.

---

## The policy framework is partially anticipated by EU developments

The paper's three policy instruments map unevenly onto existing initiatives. **Governance infrastructure investment** has strong philosophical backing from the French Presidency's 2022 Declaration on European Digital Commons and the newly launched EDIC Digital Commons (December 2025), though these focus on code infrastructure rather than governance tools. **Business model transparency requirements** represent the **least anticipated** instrument — neither the Digital Services Act, Digital Markets Act, nor Cyber Resilience Act requires companies to disclose how they benefit from digital commons. This is a genuine policy gap the paper identifies. **Ecosystem plurality** is implicitly present in EU digital sovereignty discourse (GAIA-X, ZenDiS, "Public Money, Public Code" procurement principles) but has never been articulated as a standalone policy goal for constraining scarcity channeling.

The EU's Cyber Resilience Act (2024) is worth noting for introducing the legal category of "open-source software steward" — the first time EU law formalizes the relationship between commercial exploitation and commons maintenance. When companies integrate open source into products, they assume manufacturer obligations. This begins to formalize the commercial-commons relationship that "business model transparency" would address, but from a security angle rather than an abundance-exploitation angle.

---

## Conclusion: a synthetic contribution with one genuinely novel policy insight

The paper under review is best understood as a **framework-building** contribution rather than a discovery of new phenomena. Its individual observations — that abundance creates scarcity, that commons face governance challenges, that firms exploit open goods — are well-documented across literatures that rarely speak to each other. The value lies in three genuine contributions. First, the formalization of "scarcity channeling" as a named, structural mechanism with a three-part typology synthesizes Simon, Anderson, Ostrom, Heller, and Benkler into a more unified analytical framework than any prior work offers. Second, the systematic application of abundance-compliance criteria to an established business model taxonomy goes beyond the ATARCA project's more narrow Web3-focused effort and Stacey's informal Creative Commons analysis. Third, and most novel, the identification of governance infrastructure as a distinct public good category fills a real gap — even Eghbal's influential work stopped at code infrastructure, and all existing government programs (Sovereign Tech Fund, OpenSSF, NGI Zero) fund code and security rather than governance tools.

The paper should fortify its novelty claims by prominently engaging with Anderson's "every abundance creates a new scarcity" (2009), Madison et al.'s Governing Knowledge Commons analysis of abundance (2022), the ATARCA anti-rival business model patterns (2022), the Atlantic Council's "success trap" report (2023), Schweik and English's empirical findings on governance as the scarce bottleneck (2012), and Frischmann's infrastructure-as-shared-resource framework (2012). The paper's narrative would be strongest if it positioned itself not as discovering the abundance-scarcity link but as providing the first systematic mechanism, typology, and policy response for a phenomenon that multiple literatures have observed without formalizing.