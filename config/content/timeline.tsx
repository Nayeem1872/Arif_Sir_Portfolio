/**
 * Timeline data for showcasing professional journey and achievements.
 * @page about
 *
 * TODO: Add your experience, projects, and contributions to the timeline.
 */
import { LinkPreview } from "@/components/ui/link-preview";
import Image from "next/image";

export const timelineData: TimelineEntry[] = [
  {
    title: "2024",
    content: (
      <div className="text-md text-fg/90 leading-tight tracking-tight md:col-span-6 md:text-lg lg:col-span-8 lg:text-2xl">
        <div className="text-fg mb-4 text-lg font-semibold md:text-xl lg:text-4xl">
          Senior Software Engineer{" "}
          <LinkPreview
            url="https://github.com/arifrahim"
            isStatic={false}
            className="text-primary underline"
          >
            @TechSolutions
          </LinkPreview>
        </div>
        <p className="mb-8">
          Leading backend development with C++ and Java, implementing CI/CD
          pipelines and managing cloud infrastructure on AWS and Azure.
        </p>
        <ul className="mb-8 list-disc">
          <li className="mb-2">
            Architected and developed high-performance trading systems using C++
            with sub-microsecond latency requirements.
          </li>
          <li className="mb-2">
            Implemented enterprise microservices architecture using Java Spring
            Boot, deployed on Kubernetes clusters with comprehensive monitoring.
          </li>
          <li className="mb-2">
            Automated cloud infrastructure deployment using Terraform and
            Jenkins, reducing deployment time by 80%.
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/screenshots/blog-full.webp"
            alt="Trading System Dashboard"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/screenshots/convoz-full.webp"
            alt="Microservices Architecture"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/screenshots/iptracker-full.webp"
            alt="Cloud Infrastructure"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/screenshots/billio-full.webp"
            alt="DevOps Pipeline"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2022",
    content: (
      <div className="text-md text-fg/90 leading-tight tracking-tight md:col-span-6 md:text-lg lg:col-span-8 lg:text-2xl">
        <div className="text-fg mb-4 text-lg font-semibold md:text-xl lg:text-4xl">
          DevOps Engineer{" "}
          <LinkPreview
            url="https://github.com/arifrahim"
            isStatic={false}
            className="text-primary underline"
          >
            @CloudTech
          </LinkPreview>
        </div>
        <ul className="mb-8 list-disc">
          <li className="mb-2">
            Automated deployment processes using Docker and Kubernetes, managing
            cloud infrastructure across multiple environments.
          </li>
          <li className="mb-2">
            Implemented comprehensive monitoring and logging solutions using
            Prometheus, Grafana, and ELK stack for system observability.
          </li>
          <li className="mb-2">
            Optimized system performance and reduced infrastructure costs by 40%
            through efficient resource allocation and auto-scaling policies.
          </li>
          <li className="mb-2">
            Established CI/CD pipelines with Jenkins and GitLab, enabling
            continuous integration and deployment for development teams.
          </li>
          <li className="mb-2">
            Collaborated with development teams to implement Infrastructure as
            Code practices using Terraform and Ansible.
          </li>
        </ul>
        <div className="grid grid-cols-3 place-items-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border-accent/20 bg-secondary/20 flex aspect-square w-20 items-center justify-center rounded-full border-[10px] object-contain shadow-sm md:w-40"
            >
              <p className="text-fg/20 text-center sm:text-xl">Badge</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "2019",
    content: (
      <div className="text-md text-fg/90 leading-tight tracking-tight md:col-span-6 md:text-lg lg:col-span-8 lg:text-2xl">
        <div className="text-fg mb-4 text-lg font-semibold md:text-xl lg:text-4xl">
          Software Developer{" "}
          <LinkPreview
            url="https://github.com/arifrahim"
            isStatic={false}
            className="text-primary underline"
          >
            @InnovationHub
          </LinkPreview>
        </div>
        <p className="mb-4">
          Started my journey in systems programming, focusing on
          high-performance applications and learning enterprise development
          practices with C/C++ and Java.
        </p>
        <ul className="mb-8 list-disc">
          <li className="mb-2">
            Developed high-performance applications using <em>C++</em> and{" "}
            <em>Java</em>, focusing on memory optimization and algorithm
            efficiency.
          </li>
          <li className="mb-2">
            Built enterprise-grade systems with Java Spring framework and
            implemented RESTful APIs for business applications.
          </li>
          <li className="mb-2">
            Learned system design principles and database optimization
            techniques with PostgreSQL and Redis.
          </li>
          <li className="mb-2">
            Contributed to open-source C++ libraries and wrote technical
            documentation for system architecture.
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/screenshots/smartone.png"
            alt="C++ Application"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/screenshots/zombieland.png"
            alt="Java Enterprise System"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <div className="col-span-2 grid grid-cols-3 place-items-center gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-square w-full items-center justify-center rounded-lg bg-indigo-400/20"
              >
                <p className="text-center font-bold text-white/80 sm:text-xl">
                  Project
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];
