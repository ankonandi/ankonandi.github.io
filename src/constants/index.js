import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  confluence,
  git,
  figma,
  jira,
  docker,
  mcfw,
  DN,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Associate Product Manager",
    icon: web,
  },
  {
    title: "Product Analyst",
    icon: mobile,
  },
  {
    title: "UX Analyst",
    icon: backend,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "Jira",
    icon: jira,
  },
  {
    name: "confluence",
    icon: confluence,
  },
];

const experiences = [
  {
    title: "Software Development Intern",
    company_name: "Diebold Nixdorf",
    icon: DN,
    iconBg: "#383E56",
    date: "January 2024 - July 2024",
    points: [
      "Collaborated on the development of the Vista Terminal Application, working closely with the team to understand market impact, business needs, user needs, business requirements, and product requirements.",
      "Leveraged C++ to identify, resolve bugs, and enhance product functionality, aligning technical solutions with user-centric goals.",
      "Conducted root cause analysis to identify recurring issues, proposing strategic fixes to enhance product stability and user experience.",
    ],
  },
  {
    title: "SDC Intern",
    company_name: "Mahindra First Choice Wheels Ltd",
    icon: mcfw,
    iconBg: "#E6DEDD",
    date: "May 2023 - July 2023",
    points: [
      "Analyzed the vehicle reselling portal to understand business processes and user requirements, providing insights for product improvements.",
      "Enhancing backend functionality, and optimizing user experience, developed practical skills in PHP and JavaScript for integrating databases.",
      "Collaborated with stakeholders to identify project needs, contributing to solution design and engaging in code reviews and debugging.",
    ],
  },
];

const testimonials = [];

const projects = [
  {
    name: "Diebetic Retinopathy Detection",
    description:
      "A machine learning model that detects diabetic retinopathy in patients, providing a quick and accurate diagnosis to prevent vision loss.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
  },

  {
    name: "NexWander",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
  },
];

export { services, technologies, experiences, testimonials, projects };
