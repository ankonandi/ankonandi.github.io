import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full"
  >
    <p className="text-white font-black text-[48px]">"</p>

    <div className="mt-1">
      <p className="text-white tracking-wider text-[18px]">{testimonial}</p>

      <div className="mt-7 flex justify-between items-center gap-1">
        <div className="flex-1 flex flex-col">
          <p className="text-white font-medium text-[16px]">
            <span className="blue-text-gradient">@</span> {name}
          </p>
          <p className="mt-1 text-secondary text-[12px]">
            {designation} of {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <a href="https://linktr.ee/ankonandi">
            <h1 className={styles.sectionHeadText}>Projects</h1>
            <p>
              🔗 <span style={{ fontWeight: "bold" }}>Explore my work</span>
            </p>
          </a>
          <br></br>

          <a href="https://aadiaan.com/">
            <h3
              className={styles.sectionSubHeadText}
              style={{ fontSize: "1.5em" }}
            >
              AADIAAN
            </h3>{" "}
            {/* Increased font size for project name */}
            <p className={styles.sectionSubText}>
              We developed a mentorship platform designed to provide affordable
              academic support to students from low- and middle-income groups.
              Worked closely with developers and design teams to build an
              intuitive user interface that promoted continuous learning.
              Conducted user research to identify key challenges and aligned
              product features with user needs, increasing engagement and
              accessibility.
            </p>
            <p>
              🔗{" "}
              <span>
                <i>Visit AADIAAN</i>
              </span>
            </p>
          </a>

          <br></br>

          <a href="https://linktr.ee/nexwander">
            <h3
              className={styles.sectionSubHeadText}
              style={{ fontSize: "1.5em" }}
            >
              Nexwander
            </h3>{" "}
            {/* Increased font size for project name */}
            <p className={styles.sectionSubText}>
              Conceptualized a travel platform connecting travelers for group
              trips, ensuring safety and seamless service integration. Led
              cross-functional teams to design features for rural tourism and
              adventure travel, boosting user engagement. Focused on creating
              solutions for both travelers and local service providers,
              enhancing the overall travel experience.
            </p>
            <p>
              🔗{" "}
              <span>
                <i>Explore Nexwander</i>
              </span>
            </p>
          </a>

          <br></br>

          <a href="https://drive.google.com/file/d/1_oirXNiQMpJN37imJaaI0EhLeTnKIwhB/view?usp=sharing">
            <h3
              className={styles.sectionSubHeadText}
              style={{ fontSize: "1.5em" }}
            >
              Mental Health in Students
            </h3>{" "}
            {/* Increased font size for project name */}
            <p className={styles.sectionSubText}>
              Working on a mental health project focused on understanding the
              challenges faced by students in managing academic pressures and
              mental well-being. Using user research methods such as surveys and
              interviews, I gathered insights into students' mental health
              concerns, coping mechanisms, and the impact of academic stress.
              The findings informed the development of strategies to improve
              mental health support and create more balanced academic
              environments.
            </p>
            <p>
              🔗{" "}
              <span>
                <i>See the Full Insights</i>
              </span>
            </p>
          </a>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");
