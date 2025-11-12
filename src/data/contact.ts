// Centralized contact & social links. Update by syncing from external repo or editing here.
export interface ContactLink {
  id: string;
  label: string;
  href: string;
  icon: string; // path under /public
  external?: boolean;
  ariaLabel?: string;
}

export interface ContactData {
  email: string;
  emailHref: string;
  links: ContactLink[];
}

// Placeholder values; replace via sync script pulling from ../lcmiles.github.io
export const contactData: ContactData = {
  email: 'lcmiles@uab.edu',
  emailHref: 'mailto:lcmiles@uab.edu',
  links: [
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/lcmiles',
      icon: '/icons/github.svg',
      external: true,
      ariaLabel: 'Visit Logan Miles GitHub profile'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/logan-miles-251521295/',
      icon: '/icons/linkedin.svg',
      external: true,
      ariaLabel: 'Visit Logan Miles LinkedIn profile'
    },
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:lcmiles@uab.edu',
      icon: '/icons/email.svg',
      external: true,
      ariaLabel: 'Send an email to Logan Miles'
    }
  ]
};

export const contactLinks = contactData.links;
