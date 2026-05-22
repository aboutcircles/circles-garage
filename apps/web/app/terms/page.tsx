import type { ReactNode } from "react";
import { getCycleInfo } from "@/lib/cycle";
import { UserBadge } from "@/components/user-badge";
import {
  Btn,
  Grid,
  Hero,
  Page,
  Pane,
  S,
  SDot,
  Section,
} from "@workspace/ui/kit";

function Clause({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div
      className="grid items-baseline gap-x-3 py-1.5"
      style={{ gridTemplateColumns: "44px 1fr" }}
    >
      <span className="font-mono text-[11px] text-faint">{n}</span>
      <div className="font-mono text-[13px] leading-[1.65] text-ink">
        {children}
      </div>
    </div>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[13px] leading-[1.65] text-ink">{children}</p>
  );
}

function Bullets({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="mt-1 ml-4 list-disc font-mono text-[13px] leading-[1.65] text-ink marker:text-faint">
      {items.map((it, i) => (
        <li key={i} className="py-0.5">
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  const cycleInfo = getCycleInfo();

  return (
    <Page
      screen="07 Terms"
      scroll
      status={
        <>
          <S k="doc" v="conditions.md" />
          <SDot />
          <S k="version" v="18.5.2026" />
          <SDot />
          <S k="cycle" v={cycleInfo.cycleOfTotal} accent />
          <UserBadge />
        </>
      }
      breadcrumb="welcome / terms"
    >
      <Grid cols="2fr 1fr" gap={12} fill>
        <Pane
          title="conditions of participation"
          hint="circles garage · 18.5.2026"
        >
          <Hero
            size="md"
            sub="The legal terms that govern participation in circles/garage. Read carefully — you'll be asked to accept these when you sign up."
          >
            terms &amp; conditions.
          </Hero>

          <Section num="01" label="organiser and program">
            <Clause n="1.1">
              Thank you for your interest in Circles Garage, a time-limited
              builder program and skill-based competition for developers and
              teams building Circles Mini Apps (the &ldquo;Program&rdquo;).
            </Clause>
            <Clause n="1.2">
              The Program is organised by Gnosis Ecosystem (Cayman) Ltd (the
              &ldquo;Organiser&rdquo;) and is intended to support the creation
              of live web-based mini apps for the Circles ecosystem and to
              reward eligible submissions that meaningfully integrate Circles
              functionality and create repeat user engagement.
            </Clause>
            <Clause n="1.3">
              Please read these Conditions of Participation and the applicable
              Privacy Notice carefully before registering, creating a builder
              profile, submitting a project, or otherwise participating in the
              Program. By doing any of the foregoing, you agree to be bound by
              these Conditions.
            </Clause>
          </Section>

          <Section num="02" label="participation">
            <Clause n="2.1">
              Participation in the Program is free of charge. No purchase,
              payment, donation, or other financial commitment is required in
              order to participate or to be selected for a prize.
            </Clause>
            <Clause n="2.2">
              The Program is a skill-based competition. Winners are selected
              based on the criteria set out in Section 7 and not by lot,
              raffle, or any other game of chance.
            </Clause>
          </Section>

          <Section num="03" label="eligibility">
            <Clause n="3.1">
              Participation is open to natural persons of at least 18 years of
              age and to legal entities acting through an authorised
              representative, unless prohibited by applicable law.
            </Clause>
            <Clause n="3.2">
              The Organiser may exclude persons or entities that are subject
              to trade sanctions, export restrictions, anti-money laundering
              restrictions, or other legal restrictions.
            </Clause>
            <Clause n="3.3">
              The Organiser may request reasonable information to verify
              eligibility, identity, age, team authority, wallet ownership,
              and compliance status before accepting a submission or awarding
              a prize.
            </Clause>
            <Clause n="3.4">
              The Organiser may determine eligibility and compliance in its
              reasonable discretion.
            </Clause>
          </Section>

          <Section num="04" label="program period">
            <Clause n="4.1">
              The Program begins on 18 May 2026 and is scheduled to run until
              30 June 2026, unless extended, shortened, suspended, or
              terminated by the Organiser.
            </Clause>
            <Clause n="4.2">
              The Program consists of weekly submission cycles. Unless
              otherwise announced, each weekly cycle closes on Sunday at
              23:59 CET/CEST.
            </Clause>
            <Clause n="4.3">
              A participant may submit one project per weekly cycle. Updated
              versions of the same project may be submitted again in later
              weekly cycles, provided they reflect meaningful progress or
              changes.
            </Clause>
          </Section>

          <Section num="05" label="submission requirements">
            <Clause n="5.1">
              To participate, the participant must create a builder profile
              through garage.aboutcircles.com and submit the information
              requested by the Organiser, which may include the project name,
              short description or pitch, selected track (if applicable),
              relevant URLs, wallet details, and any other information
              reasonably required for the administration of the Program.
            </Clause>
            <Clause n="5.2">
              Eligible submissions must consist of a live, accessible
              web-based mini app or such other project format as the Organiser
              may expressly permit on the Garage website or through other
              Program communications. Unless otherwise announced, command-line
              tools, scripts, libraries, or other non-hosted software are not
              eligible submissions. Mini apps may be built as embedded mini
              apps or standalone web apps, provided they are live and usable
              by end users.
            </Clause>
            <Clause n="5.3">
              The Organiser may publish or update technical, functional,
              chain-specific, disclosure, verification, hosting, testing, and
              other submission requirements on garage.aboutcircles.com or
              through other Program communications from time to time.
              Participants are responsible for reviewing and complying with
              any such requirements applicable to the relevant weekly cycle.
            </Clause>
            <Clause n="5.4">
              Unless otherwise announced by the Organiser, submissions are
              expected to make meaningful use of Circles-related functionality
              and to be compatible with the technical environment specified on
              garage.aboutcircles.com for the relevant weekly cycle.
            </Clause>
            <Clause n="5.5">
              The participant is responsible for ensuring that the submission
              is lawful, functional, non-malicious, and does not infringe any
              third-party rights.
            </Clause>
            <Clause n="5.6">
              The Organiser may, for security, legal, or user-experience
              reasons, impose restrictions on the types of blockchain
              operations that can be initiated from within the Circles
              mini-app environment, including by blacklisting or otherwise
              blocking specific transaction types or contract interactions
              and by requiring additional confirmations or previews of
              certain operations. The participant acknowledges that such
              measures may affect how a submission behaves when accessed
              through the Circles mini-app environment and that the Organiser
              is not obliged to support every possible operation or
              integration.
            </Clause>
            <Clause n="5.7">
              Participants must comply with these Conditions, all instructions
              and technical requirements published on garage.aboutcircles.com
              or otherwise communicated by the Organiser in connection with
              the Program, including any requirements relating to submission
              format, disclosures, testing, verification, deadlines, or
              changes to the Program.
            </Clause>
          </Section>

          <Section num="06" label="responsibilities">
            <Clause n="6.1">
              Participants are solely responsible for developing, hosting,
              operating, maintaining, and securing their submissions.
            </Clause>
            <Clause n="6.2">
              Participants must not submit any project that:
              <Bullets
                items={[
                  "contains malware, malicious code, exploits, or harmful functionality;",
                  "infringes intellectual property, privacy, publicity, or other third-party rights;",
                  "violates applicable law or regulation;",
                  "is misleading, fraudulent, abusive, hateful, discriminatory, or otherwise inappropriate; or",
                  "is designed primarily to manipulate metrics, spam users, or artificially inflate activity.",
                ]}
              />
            </Clause>
            <Clause n="6.3">
              Participants are responsible for all taxes, reporting
              obligations, licences, consents, transaction fees, and
              third-party terms applicable to their submissions and to any
              prize received.
            </Clause>
          </Section>

          <Section num="07" label="selection criteria">
            <Clause n="7.1">
              The Program is judged by a jury appointed by the Organiser.
            </Clause>
            <Clause n="7.2">
              In each weekly cycle, the jury will assess eligible submissions
              using skill-based qualitative criteria, including in particular:
              <Bullets
                items={[
                  "the degree to which the submission meaningfully uses Circles primitives;",
                  "whether the submission is approachable and compelling for non-crypto users;",
                  "the quality of the user interface and user experience;",
                  "the extent to which the submission drives weekly referrals or user acquisition; and",
                  "the extent to which the submission drives meaningful weekly activity within the Circles ecosystem.",
                ]}
              />
            </Clause>
            <Clause n="7.3">
              The jury may also consider technical quality, reliability,
              originality, security, completeness, and demonstrated progress
              from prior submissions.
            </Clause>
            <Clause n="7.4">
              The Organiser may publish or update further guidance on the
              judging criteria, scoring framework, or weekly focus areas on
              garage.aboutcircles.com or through Program communications,
              provided that any such guidance remains consistent with the
              skill-based nature of the Program.
            </Clause>
            <Clause n="7.5">
              The Organiser may decide not to award one or more prizes in a
              weekly cycle if, in the jury&rsquo;s reasonable opinion, no
              eligible submission meets the minimum quality and relevance
              threshold described in these Conditions.
            </Clause>
          </Section>

          <Section num="08" label="awards">
            <Clause n="8.1">
              In each weekly cycle, the Organiser may award prizes to eligible
              submissions ranked first, second, and third by the jury.
            </Clause>
            <Clause n="8.2">
              Unless otherwise announced, the indicative weekly prize pool is
              up to USD 500 equivalent, intended to be allocated as follows:
              first prize, USD 250 equivalent; second prize, USD 150
              equivalent; and third prize, USD 100 equivalent.
            </Clause>
            <Clause n="8.3">
              Prizes are intended to be paid in Circles (CRC) via a
              Circles-compatible group currency to the participant&rsquo;s
              Circles account, unless the Organiser expressly states
              otherwise.
            </Clause>
            <Clause n="8.4">
              Where a prize is described by reference to a USD value, the
              Organiser may, in its reasonable discretion, determine how to
              calculate the corresponding amount of Circles to be paid,
              including the applicable reference rate and timing of
              valuation; any such calculation will be made in good faith and
              is final and binding, absent manifest error.
            </Clause>
            <Clause n="8.5">
              Any person identified as a winner is a potential prize recipient
              only, subject to notification, verification, eligibility review,
              and compliance with these Conditions.
            </Clause>
            <Clause n="8.6">
              The Organiser may require a potential prize recipient to provide
              confirmations, declarations, wallet information, or other
              reasonably requested documents within a specified timeframe. If
              a potential prize recipient cannot be reached, does not respond,
              does not provide the requested materials in time, is found
              ineligible, or otherwise fails to satisfy the Conditions, the
              Organiser may withdraw the prize and select an alternate winner
              or decide not to award that prize.
            </Clause>
            <Clause n="8.7">
              Prizes are non-transferable except with the Organiser&rsquo;s
              prior written consent. No substitute or cash equivalent is owed
              unless the Organiser expressly agrees otherwise.
            </Clause>
            <Clause n="8.8">
              The Organiser is not responsible for disputes among team members
              regarding allocation of any prize. Unless the Organiser agrees
              otherwise in writing, prize consideration will be paid only to
              the registered participant or team representative identified in
              the winning submission.
            </Clause>
          </Section>

          <Section num="09" label="leaderboard">
            <Clause n="9.1">
              The Program may include a public leaderboard displaying certain
              participants and metrics relating to their submissions and
              activity in the Circles ecosystem.
            </Clause>
            <Clause n="9.2">
              Where a leaderboard is used it may display the name or title of
              the participant&rsquo;s submission; and a link or other
              reference that allows users to open or access the submission.
            </Clause>
            <Clause n="9.3">
              Participation in the Program includes participation in any
              public leaderboard used by the Organiser. Participants
              acknowledge that their submission name and the associated link
              or reference may be displayed publicly for the duration of the
              Program and for a reasonable period thereafter.
            </Clause>
          </Section>

          <Section num="10" label="intellectual property">
            <Clause n="10.1">
              Participants retain ownership of the intellectual property
              rights in their submissions, except for any third-party
              materials and except as otherwise agreed separately.
            </Clause>
            <Clause n="10.2">
              By submitting a project, each participant grants the Organiser
              and its affiliated ecosystem partners a worldwide, non-exclusive,
              royalty-free licence for the duration of the applicable
              intellectual property rights to:
              <Bullets
                items={[
                  "review, test, evaluate, copy, reproduce, host, store, cache, and demonstrate the submission in connection with the Program;",
                  "use the project name, screenshots, logos, short descriptions, and publicly submitted materials to publicise the Program, the participant's involvement, and the results of the Program;",
                  "use, display, perform, transmit, make available, and distribute display or refer to the submission on garage.aboutcircles.com, marketplaces, event materials, and social media channels; and",
                  "make such technical modifications, formatting changes, and adaptations to the submission and related materials as are reasonably necessary to host, display, test, review, demonstrate, list, index, feature, or otherwise make the submission available in connection with the Program, the Circles ecosystem, and the products, services, websites, applications, and communications of the Organiser and its affiliated ecosystem partners.",
                ]}
              />
            </Clause>
            <Clause n="10.3">
              Section 10 does not transfer ownership of the submission to the
              Organiser and does not oblige the Organiser to list, integrate,
              fund, or continue supporting any submission. For the avoidance
              of doubt, nothing in these Conditions restricts or limits the
              Organiser or its affiliated ecosystem partners from
              independently developing, acquiring, licensing, or marketing
              products or services that are similar to, derived from,
              inspired by, or that compete with any submission. The Organiser
              and its affiliated ecosystem partners shall have no obligation
              to refrain from any such activities or to compensate any
              participant for doing so, provided only that they do not
              infringe any intellectual property rights in a submission in
              breach of applicable law or any separate written agreement.
            </Clause>
          </Section>

          <Section num="11" label="confidentiality and publicity">
            <Clause n="11.1">
              Unless the Organiser expressly states that certain materials
              must remain confidential, submissions should be treated as
              non-confidential.
            </Clause>
            <Clause n="11.2">
              Participants must not disclose any non-public credentials,
              private keys, privileged access, unpublished security issues,
              or other confidential information provided by the Organiser or
              encountered in the course of the Program.
            </Clause>
            <Clause n="11.3">
              The Organiser may publicly identify participants, shortlisted
              submissions, winners, and prize recipients, and may publish
              related project descriptions and promotional content. To the
              extent permitted by applicable law, each participant grants the
              Organiser and its affiliated ecosystem partners a non-exclusive,
              worldwide, royalty-free right to use the participant&rsquo;s
              name, handle, logo, biographical information, image, likeness,
              and statements about the Program for the purpose of
              administering, documenting, promoting, and publicising the
              Program and related ecosystem activities, in any media, without
              additional compensation. Where mandatory law requires separate
              consent for particular uses, the Organiser will obtain such
              consent.
            </Clause>
          </Section>

          <Section num="12" label="no advice">
            <Clause n="12.1">
              The Program, the website garage.aboutcircles.com, and any
              related communications are provided for informational and
              program-administration purposes only.
            </Clause>
            <Clause n="12.2">
              Neither the Organiser nor any affiliated person provides
              investment, financial, legal, tax, or regulatory advice through
              the Program.
            </Clause>
            <Clause n="12.3">
              Participants are solely responsible for assessing the legal,
              technical, tax, and commercial implications of building,
              operating, or using any submission.
            </Clause>
          </Section>

          <Section
            num="13"
            label="participant warranties and organiser disclaimers"
          >
            <Clause n="13.1">
              Each participant represents and warrants that:
              <Bullets
                items={[
                  "it has full authority and capacity to enter into these Conditions and to participate in the Program;",
                  "all information submitted to the Organiser in connection with the Program is true, accurate, and not misleading;",
                  "the submission, participant materials, and any participant marks do not infringe, misappropriate, or otherwise violate any third-party intellectual property, privacy, publicity, contractual, or other rights;",
                  "the submission complies with applicable law and regulation, including sanctions, export control, consumer protection, advertising, and data protection law to the extent applicable to the participant and the submission; and",
                  "the participant has obtained all permissions, licences, and consents necessary to submit the project and allow the Organiser to exercise the rights granted under these Conditions.",
                ]}
              />
            </Clause>
            <Clause n="13.2">
              The Program, the website garage.aboutcircles.com, the Circles
              documentation, and any related tools, APIs, SDKs, or materials
              are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
              without any representation or warranty of any kind, whether
              express, implied, or statutory, to the maximum extent permitted
              by law.
            </Clause>
            <Clause n="13.3">
              The Organiser does not warrant that:
              <Bullets
                items={[
                  "the Program will be uninterrupted, error-free, or secure;",
                  "any submission will be reviewed, shortlisted, awarded, listed, or otherwise promoted;",
                  "any prize asset will maintain a stable or predictable value; or",
                  "any technical integration will function without errors or third-party dependencies.",
                ]}
              />
            </Clause>
            <Clause n="13.4">
              Participants acknowledge that blockchain-based systems, smart
              contracts, cryptographic wallets, and token-based assets involve
              technological, cybersecurity, legal, and market risks.
            </Clause>
          </Section>

          <Section num="14" label="indemnity">
            <P>
              Each participant shall indemnify and hold harmless the Organiser
              and its affiliates, officers, employees, agents, contractors,
              partners, and service providers from and against any third-party
              claims, losses, damages, liabilities, penalties, costs, and
              expenses (including reasonable legal fees) arising out of or in
              connection with: (a) the participant&rsquo;s submission; (b) the
              participant&rsquo;s breach of these Conditions; (c) infringement
              or alleged infringement of third-party rights by the submission
              or participant materials; or (d) the participant&rsquo;s
              violation of applicable law.
            </P>
          </Section>

          <Section num="15" label="liability">
            <Clause n="15.1">
              To the maximum extent permitted by law, the Organiser and its
              affiliates, officers, employees, agents, contractors, and
              partners shall not be liable for any indirect, incidental,
              special, consequential, exemplary, or punitive damages, or for
              any loss of profits, revenue, data, goodwill, opportunity,
              digital assets, or business interruption, arising out of or in
              connection with the Program.
            </Clause>
            <Clause n="15.2">
              Nothing in these Conditions excludes or limits liability for
              fraud, wilful misconduct, death or personal injury caused by
              negligence, or any other liability that cannot be excluded under
              applicable law.
            </Clause>
            <Clause n="15.3">
              The participant remains solely responsible for the submission,
              its operation, and any interaction with end users or third-party
              services.
            </Clause>
          </Section>

          <Section num="16" label="suspension, exclusion, changes">
            <Clause n="16.1">
              The Organiser may reject, suspend, disqualify, or remove a
              participant or submission at any time if the Organiser
              reasonably believes that:
              <Bullets
                items={[
                  "these Conditions have been violated;",
                  "the participant has acted dishonestly, abusively, unlawfully, or unfairly;",
                  "the submission presents security, legal, reputational, or technical risks; or",
                  "the integrity or proper administration of the Program would otherwise be compromised.",
                ]}
              />
            </Clause>
            <Clause n="16.2">
              The Organiser may amend these Conditions, the judging process,
              the schedule, the prize structure, or any aspect of the Program
              where reasonably necessary for legal, technical, operational, or
              security reasons. Material changes will be published or
              otherwise communicated appropriately.
            </Clause>
            <Clause n="16.3">
              The Organiser may suspend or terminate the Program at any time
              where necessary for legal, technical, operational, or security
              reasons.
            </Clause>
          </Section>

          <Section num="17" label="data protection">
            <Clause n="17.1">
              Information about how personal data is collected and processed
              in connection with the Program is set out in the applicable
              privacy notice available at [insert privacy notice of GEL
              Cayman].
            </Clause>
            <Clause n="17.2">
              By participating, the participant acknowledges that the
              Organiser may process registration, submission, contact,
              wallet, and related program-administration data in accordance
              with that privacy notice and applicable law.
            </Clause>
          </Section>

          <Section num="18" label="governing law and jurisdiction">
            <P>
              These Conditions of Participation and any dispute or claim
              (including non-contractual disputes or claims) arising out of
              or in connection with it or its subject matter or formation
              shall be governed by and construed in accordance with the law
              of England and Wales. Both, the Organiser and you irrevocably
              agree that the courts of England and Wales shall have exclusive
              jurisdiction over any dispute or claim (including
              non-contractual disputes or claims) arising out of or in
              connection with these Conditions of Participation. The
              exclusive place of jurisdiction is London.
            </P>
          </Section>

          <Section num="19" label="miscellaneous">
            <Clause n="19.1">
              Participation in the Program does not create any employment,
              agency, partnership, joint venture, fiduciary, or franchise
              relationship between the participant and the Organiser or any
              affiliated person. Participants have no authority to bind the
              Organiser or to make any representations on its behalf unless
              expressly authorised in writing.
            </Clause>
            <Clause n="19.2">
              If any provision of these Conditions is held to be invalid,
              illegal, or unenforceable, the remaining provisions shall
              remain in full force and effect.
            </Clause>
            <Clause n="19.3">
              No failure or delay by the Organiser in exercising any right
              under these Conditions shall operate as a waiver of that right.
            </Clause>
            <Clause n="19.4">
              These Conditions, together with any documents expressly
              incorporated by reference, constitute the entire agreement
              between the Organiser and the participant regarding the Program
              and supersede prior discussions relating to the same subject
              matter.
            </Clause>
            <Clause n="19.5">
              The Organiser may assign or transfer these Conditions or any of
              its rights or obligations under them to an affiliate or in
              connection with a reorganisation, merger, or transfer of the
              Program. Participants may not assign or transfer their rights
              or obligations without the Organiser&rsquo;s prior written
              consent.
            </Clause>
            <Clause n="19.6">
              Sections that by their nature are intended to survive
              termination or expiry of the Program shall survive, including
              intellectual property, publicity, disclaimers, liability,
              indemnity, tax, data protection, and governing law/dispute
              provisions.
            </Clause>
          </Section>

          <div className="mt-7 border-t border-hair pt-3 font-mono text-[11px] text-faint">
            ↳ version dated 18 May 2026. questions? reach the team in the
            builder telegram (link on the landing page).
          </div>
        </Pane>

        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto" }}
        >
          <Pane title="at a glance" hint="not legal advice">
            <div className="font-mono text-[13px] leading-[1.65]">
              <P>
                These Conditions govern participation in circles/garage. You
                must accept them when you sign up.
              </P>
              <div className="mt-3 border-t border-dotted border-hair pt-3 text-[11px] text-faint">
                <div className="py-1">
                  <span className="text-ink">organiser ·</span> Gnosis
                  Ecosystem (Cayman) Ltd
                </div>
                <div className="py-1">
                  <span className="text-ink">program period ·</span> 18 May —
                  30 Jun 2026
                </div>
                <div className="py-1">
                  <span className="text-ink">cycle close ·</span> Sunday 23:59
                  CET/CEST
                </div>
                <div className="py-1">
                  <span className="text-ink">governing law ·</span> England
                  and Wales
                </div>
                <div className="py-1">
                  <span className="text-ink">jurisdiction ·</span> London
                </div>
              </div>
            </div>
          </Pane>

          <Pane title="next steps" hint="go ship">
            <div className="flex flex-col items-stretch gap-2.5">
              <Btn primary href="/signup">
                → sign up
              </Btn>
              <Btn href="/rules">→ read the rules</Btn>
              <Btn ghost href="/">
                ← back to landing
              </Btn>
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
