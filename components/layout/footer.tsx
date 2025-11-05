import { footerLinks } from "@/config/footerLinks";
import { profile as profileInfo } from "@/config/profile";
import { getProfile } from "@/lib/queries";
import type { Profile } from "@/types/data";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconExternalLink,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";
import LinkUnderline from "../common/link";
import { SlideIn } from "../ui/transitions";

interface FooterLink {
  title: string;
  href: string;
  label?: string;
  isInternal?: boolean;
}

const FooterLink = ({
  title,
  href,
  label = undefined,
  isInternal = true,
}: FooterLink) => {
  if (label === "soon") {
    return (
      <span className="footer-link cursor-not-allowed">
        {title}
        <span className="bg-primary/20 text-primary rounded-full px-1 py-0.5 text-[8px] uppercase">
          {label}
        </span>
      </span>
    );
  }

  if (isInternal) {
    return (
      <div className="flex items-center gap-1">
        <LinkUnderline href={href} className="footer-link" label={title} />
        {label && (
          <span className="bg-primary/20 text-primary rounded-full px-1 py-0.5 text-[8px] uppercase">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <LinkUnderline
        href={href}
        target="_blank"
        className="footer-link"
        label={title}
      />
      <IconExternalLink className="text-text-muted h-4 w-4" />
      {label && (
        <span className="bg-primary/20 text-primary rounded-full px-1 py-0.5 text-[8px] uppercase">
          {label}
        </span>
      )}
    </div>
  );
};

interface FooterGroupProps {
  title: string;
  links: Array<FooterLink>;
}

const FooterGroup = ({ title, links }: FooterGroupProps) => {
  return (
    <div className="flex-1">
      <h2 className="text-text-muted mb-2 px-2 text-sm font-normal">{title}</h2>
      <ul className="flex flex-col">
        {links.map(({ title: linkTitle, href, label, isInternal }) => (
          <li key={href}>
            <FooterLink
              title={linkTitle}
              href={href}
              label={label}
              isInternal={isInternal}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterDescription = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex max-w-sm flex-col">
      <div className="text-text-muted mb-3 text-sm">About Me</div>
      <p className="text-fg mb-4 leading-relaxed font-normal">{profile?.bio}</p>
      <ul className="-ml-3 flex items-center gap-1">
        <li>
          <a
            href={profile?.socials?.linkedin ?? undefined}
            target="_blank"
            rel="noreferrer nofollow"
            className="hover:text-primary text-text-secondary flex h-9 w-9 items-center justify-center transition duration-100 hover:scale-105"
            aria-label="My LinkedIn profile"
            title="Connect on LinkedIn"
          >
            <IconBrandLinkedin className="h-5 w-5" />
          </a>
        </li>
        <li>
          <a
            href={profile?.socials?.github ?? undefined}
            target="_blank"
            rel="noreferrer nofollow"
            className="hover:text-primary text-text-secondary flex h-9 w-9 items-center justify-center transition duration-100 hover:scale-105"
            aria-label="My GitHub profile"
            title="View my GitHub profile"
          >
            <IconBrandGithub className="h-5 w-5" />
          </a>
        </li>
        <li>
          <a
            href={`mailto:${profile?.socials?.email}`}
            target="_blank"
            rel="noreferrer nofollow"
            className="hover:text-primary text-text-secondary flex h-9 w-9 items-center justify-center transition duration-100 hover:scale-105"
            aria-label="Email Me"
            title="Email Me"
          >
            <IconMail className="h-5 w-5" />
          </a>
        </li>
        <li>
          <a
            href={profile?.socials?.facebook ?? undefined}
            target="_blank"
            rel="noreferrer nofollow"
            className="hover:text-primary text-text-secondary flex h-9 w-9 items-center justify-center transition duration-100 hover:scale-105"
            aria-label="My Facebook profile"
            title="Visit my Facebook profile"
          >
            <IconBrandFacebook className="h-5 w-5" />
          </a>
        </li>
        <li>
          <a
            href={profile?.socials?.twitter ?? undefined}
            target="_blank"
            rel="noreferrer nofollow"
            className="hover:text-primary text-text-secondary flex h-9 w-9 items-center justify-center transition duration-100 hover:scale-105"
            aria-label="My Twitter profile"
            title="Visit my Twitter profile"
          >
            <IconBrandX className="h-5 w-5" />
          </a>
        </li>

        {profile?.location ? (
          <li className="ml-auto">
            <SlideIn>
              <div className="text-text-muted flex items-center justify-center gap-0.5 text-sm">
                <IconMapPin className="h-5 w-5" />
                <p>{profile.location}</p>
              </div>
            </SlideIn>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

const Footer = async () => {
  const profile = await getProfile();

  return (
    <footer className="text-fg border-border relative mt-8 w-full border-t pt-16 text-sm lg:mt-10">
      <div className="max-container">
        <div className="py-10">
          <div className="flex flex-col-reverse gap-16 lg:flex-row">
            <div className="flex-1 p-4">
              <FooterDescription profile={profile} />
            </div>
            <div className="flex flex-1 flex-col gap-8 sm:flex-row sm:justify-center sm:gap-16 lg:mx-0">
              <div className="flex p-4 sm:gap-16">
                {footerLinks.slice(0, 2).map((group) => (
                  <FooterGroup
                    key={group.title}
                    title={group.title}
                    links={group.links}
                  />
                ))}
              </div>
              <div className="flex p-4 sm:gap-16">
                <FooterGroup
                  title={footerLinks[2].title}
                  links={footerLinks[2].links}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-border/50 flex w-full justify-between border-t px-4 py-6 text-xs">
          <div className="text-text-secondary font-semibold">
            {profileInfo.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
