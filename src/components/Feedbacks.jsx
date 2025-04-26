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
          <br />

          {/* AADIAAN */}
          <a href="https://aadiaan.com/">
            <h3
              className={styles.sectionSubHeadText}
              style={{ fontSize: "1.5em" }}
            >
              AADIAAN
            </h3>
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
          <br />

          {/* Telemedicine Platform */}
          <a href="https://www.figma.com/proto/DLaW07GH9AV8yoYYXbDS5W/MediCare-Prototype?node-id=4017-376&p=f&t=EAe0R0ZJMrAX8gbS-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=4017%3A376">
            <h3
              className={styles.sectionSubHeadText}
              style={{ fontSize: "1.5em" }}
            >
              Medicare Connect: Telemedicine Platform for Elderly Users
            </h3>
            <p className={styles.sectionSubText}>
              Developing a telemedicine solution tailored for older adults,
              grounded in extensive user research. Features include emergency
              medicine ordering, customizable medication reminders, discounted
              subscription plans, caregiver portal access, and a hybrid care
              model combining virtual and in-person visits. Usability testing is
              planned to further refine and validate these features.
            </p>
            <p>
              🔗{" "}
              <span>
                <i>View Prototype</i>
              </span>
            </p>
          </a>
          <br />

          {/* Nexwander */}
          <a href="https://linktr.ee/nexwander">
            <h3
              className={styles.sectionSubHeadText}
              style={{ fontSize: "1.5em" }}
            >
              Nexwander
            </h3>
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
          <br />

          {/* Equifocus.ai */}
          <a href="https://equifocus.ai">
            <h3
              className={styles.sectionSubHeadText}
              style={{ fontSize: "1.5em" }}
            >
              Equifocus.ai
            </h3>
            <p className={styles.sectionSubText}>
              Made Equifocus.ai focused on understanding the challenges students
              face in managing academic pressures and mental well-being. Used
              user research methods such as surveys and interviews to gather
              insights into students' mental health concerns and coping
              mechanisms. The findings informed strategies to improve mental
              health support and foster balanced academic environments, driving
              actionable improvements in student well-being.
            </p>
            <p>
              🔗{" "}
              <span>
                <i>See the Full Insights</i>
              </span>
            </p>
          </a>

          <br />

          {/* Exoskeleton for Assisted Arm Movement */}
          <a href="https://drive.google.com/drive/folders/1wXroF0gyi9FtA10pGshKuibCRiYHDQ-Q?usp=sharing">
            <h3
              className={styles.sectionSubHeadText}
              style={{ fontSize: "1.5em" }}
            >
              Exoskeleton for Assisted Arm Movement
            </h3>
            <p className={styles.sectionSubText}>
              Developed an Exoskeleton for physiotherapy, enabling users to
              perform controlled arm movements for rehabilitation. Initially
              using EMG sensors to detect muscle signals, the system was pivoted
              to use a MPU9250 sensor for wrist-based control, allowing for more
              precise and user-friendly functionality. The system is powered by
              150kg/cm high-torque servos, ensuring effective arm movement
              assistance. Additionally, a dedicated mobile app was built,
              offering intuitive control and real-time monitoring of the
              exoskeleton's performance. The app allows users to adjust
              settings, track progress, and ensure a personalized rehabilitation
              experience. The project underwent multiple testing iterations,
              ensuring reliability and optimal performance.
            </p>
            <p>
              🔗{" "}
              <span>
                <i>Explore the Project</i>
              </span>
            </p>
          </a>
          <br />

          {/* IIITH Marketplace */}
          <h3
            className={styles.sectionSubHeadText}
            style={{ fontSize: "1.5em" }}
          >
            IIITH Marketplace
          </h3>
          <p className={styles.sectionSubText}>
            Built a marketplace platform for IIIT Hyderabad students, improving
            over cluttered WhatsApp groups where students previously bought and
            sold second-hand items without proper categories or search options.
            Introduced a unique feature allowing students to request deliveries
            of food, parcels, or any other items from the canteen or within
            campus to their hostels. Added a payment method using the seller's
            QR code, allowing payments to be made directly to the seller when an
            item is listed. This approach eliminated the hassle of gateway
            charges, as the amounts being dealt with are typically lower.
            Conducted user research to uncover key pain points, ensuring the
            platform was intuitive, fast, and solved the major hassles faced by
            the student community.
          </p>
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

export default SectionWrapper(Feedbacks, "projects");
