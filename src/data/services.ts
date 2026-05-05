export interface ServiceItem {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  items: ServiceItem[];
}

export const services: Service[] = [
  {
    slug: 'design',
    title: 'Design Services',
    tagline: 'From Concept to Production-Ready Design',
    description:
      'Our experienced team of designers is dedicated to creating innovative and visually appealing designs that resonate with your target market. We ensure your product is not only aesthetically pleasing but also practical to produce.',
    highlights: ['Start-Ups', 'Established Businesses', 'Home Inventors'],
    items: [
      {
        title: 'Concept Development and Ideation',
        description:
          'It starts with concept development and ideation, where our experienced team collaborates with you to refine your vision and transform it into a viable product concept.',
      },
      {
        title: 'Product Styling and Planning',
        description:
          'We specialize in product styling and planning, leveraging our expertise in aesthetics, ergonomics, and user experience to create products that stand out in the market.',
      },
      {
        title: 'Photo-Realistic Renderings and Animations',
        description:
          'Using advanced technologies and tools, we provide photo-realistic renderings and animations that bring your product to life before it even hits the production line.',
      },
      {
        title: '2D and 3D Design Layouts',
        description:
          'Our 2D and 3D design layouts allow for detailed visualization and precise engineering.',
      },
      {
        title: 'Component and Assembly Design and Development',
        description:
          'Our team excels in component and assembly design, ensuring seamless integration and functionality.',
      },
      {
        title: '3D Solid Modeling, Simulation and Finite Element Analysis (FEA)',
        description:
          "We go beyond design aesthetics by offering 3D solid modeling, simulation, and finite element analysis (FEA) to validate and optimize your product's performance.",
      },
      {
        title: 'Design for Manufacturability & Assembly (DFM/DFA)',
        description:
          'Our design for manufacturability and assembly expertise ensures that your product can be efficiently manufactured without compromising quality.',
      },
      {
        title: 'Board-Level Electrical Design (Hardware/Software/Firmware)',
        description:
          'For products with electrical components, we outsource to our board-level electrical design team that specializes in hardware, software, and firmware development.',
      },
      {
        title: 'Comprehensive Material Analysis and Selection',
        description:
          'We provide comprehensive material analysis and selection, considering factors such as durability, cost-effectiveness, and sustainability.',
      },
      {
        title: 'Mechanical and Electro-Mechanical Packaging',
        description:
          'Our mechanical and electro-mechanical packaging services ensure that your product is safely and efficiently housed, ready for distribution and use.',
      },
      {
        title: 'Proof-of-Concept Prototype through Final Design Release',
        description:
          "From proof-of-concept prototypes to final design release, we offer a wide range of assembly build methods tailored to your product's needs.",
      },
      {
        title: 'Documentation and Revision Control',
        description:
          "Our documentation and revision control processes guarantee that your product's specifications are accurately maintained throughout its lifecycle.",
      },
      {
        title: 'Design Consultation',
        description:
          'Our Design Consultation service is ideal for teams and individuals developing their own products who need expert mechanical design input without fully outsourcing the work. We provide focused guidance to review concepts, solve design challenges, and improve manufacturability, performance, and cost.',
      },
    ],
  },
  {
    slug: 'tooling',
    title: 'Tooling & Production Setup Services',
    tagline: 'Precision Tooling for Every Production Need',
    description:
      'We offer comprehensive tooling and production setup services to optimize your manufacturing processes. Our services ensure a seamless transition from prototyping to high-volume production.',
    highlights: ['Versatile Capabilities', 'Industry Leading Expertise', 'Precision Technology'],
    items: [
      {
        title: 'Tool Planning and Scheduling',
        description:
          'We offer a comprehensive range of tooling services designed to meet the diverse needs of our clients. With our tool planning and scheduling, we ensure that your project stays on track and meets its timeline objectives.',
      },
      {
        title: 'Comprehensive Material Selection, Documentation & Revision Control',
        description:
          'We understand the criticality of material selection in tooling, and we offer comprehensive material expertise, documentation, and revision control to ensure the right materials are utilized for optimal performance.',
      },
      {
        title: 'Plastic Injection Mold Tools, Thermoforming Tools, Foam Tools, Blow Mold Tools, Compression Mold Tools and Extrusion Dies',
        description:
          'We specialize in the design and manufacturing of Plastic Injection Mold Tools, Thermoforming Tools, Low-High Pressure Foam Tools, Blow Mold Tools, Compression Mold Tools, and Extrusion Dies. Our experienced team ensures the highest quality standards and precision in every tool we create.',
      },
      {
        title: 'Metal Casting Tools, Stamping Dies, Forming and Extrusion Dies',
        description:
          'Whether you require complex metal casting tools, precision stamping dies, or reliable forming and extrusion dies, our skilled team is equipped to meet your unique needs with durable, efficient, and cost-effective tooling solutions.',
      },
      {
        title: 'Prototype, Bridge, Pilot and High Volume Production Tools',
        description:
          'Whether you need to create a prototype to test your product concept or require tools for larger-scale production, we have the expertise and capabilities to support your needs at every stage.',
      },
      {
        title: 'Tool Design and Construction to World-Wide Tooling Standards',
        description:
          'Our team excels in tool design and construction, adhering to world-wide tooling standards to ensure the highest quality and compatibility with your manufacturing setup.',
      },
      {
        title: 'Export and Non-Export Tooling',
        description:
          'We understand the complexities of tooling in different markets and offer both export and non-export tooling options to meet your specific requirements.',
      },
      {
        title: 'Component & Assembly Verification, Evaluation and Validation',
        description:
          'Our dedicated team conducts component and assembly verification, evaluation, and validation to ensure the functionality, reliability, and quality of the final product.',
      },
    ],
  },
  {
    slug: 'production',
    title: 'Production Integration Services',
    tagline: 'Seamless Manufacturing from Prototype to Mass Production',
    description:
      'From plastic injection molding and metal die casting to PCB assembly and beyond, we deliver high-quality and efficient manufacturing solutions across a diverse range of industries.',
    highlights: [
      'Robust Supply Chain Management',
      'Efficient Assembly Processes',
      'Comprehensive Quality Control',
    ],
    items: [
      {
        title: 'Production Assembly Planning, Scheduling & Forecasting',
        description:
          'We offer comprehensive production integration services that seamlessly bring together various manufacturing processes. We work closely with our clients to ensure production goals are met with precise planning, scheduling, and forecasting.',
      },
      {
        title: 'Plastic Injection Molding, Extrusion Molding, Foam Molding, Blow Molding and Compression Molding',
        description:
          'Our state-of-the-art facilities deliver high-quality and efficient manufacturing solutions. We have the capabilities to meet your unique requirements across all major molding techniques.',
      },
      {
        title: 'Metal Die Casting, Investment Casting, Extrusions, Stamping, Forming, Fabricating and CNC',
        description:
          'Whether you require high-precision metal die casting, intricate investment casting, versatile extrusions, precise stamping, complex forming, reliable fabrication, or accurate CNC machining, we have the capabilities to meet your needs.',
      },
      {
        title: 'Printed Circuit Board Assembly, Wire Harness, Components, Sub-Assemblies and Turn-Key Solutions',
        description:
          'Our team has the technical expertise to handle complex electronic assemblies, ensuring quality and reliability throughout the production process.',
      },
      {
        title: 'Low-Volume Pilot-Production through High-Volume Mass Production Builds',
        description:
          'From low-volume pilot production to high-volume mass production builds, we have the flexibility and scalability to meet your production needs at every stage.',
      },
      {
        title: 'Plastics, Metals, PCBA, Resins, Textile Apparel, Leather, Wood, and Paper Products',
        description:
          'Whether you need plastic components, precision metal parts, PCB assemblies, resin-based products, textile apparel, leather goods, wooden items, or paper-based solutions, Regatta can bring your designs to life.',
      },
      {
        title: 'Assembly, Kitting, Testing, Packaging, Warehousing and Order Fulfillment',
        description:
          'We provide services past production as well, including assembly, kitting, testing, packaging, warehousing, and order fulfillment. Our attention to detail ensures products are delivered with accuracy and in compliance with your specifications.',
      },
    ],
  },
  {
    slug: 'fulfillment',
    title: 'Fulfillment Services',
    tagline: 'End-to-End Delivery for Every Sales Channel',
    description:
      "Our robust fulfillment services ensure seamless order processing and delivery. Whether it's web-sale end-customer fulfillment or EDI fulfillment for big-box retailers, we provide a streamlined logistics experience.",
    highlights: [
      'Customized Packaging',
      'Reliable Inventory Management',
      'Timely Order Processing',
    ],
    items: [
      {
        title: 'Fulfillment Planning, Scheduling & Forecasting',
        description:
          'We offer comprehensive fulfillment services that encompass planning, scheduling, and forecasting, ensuring that your products are delivered on time and meet customer demands.',
      },
      {
        title: 'Component & Assembly Kitting, Packaging & Warehousing',
        description:
          'Our fulfillment team ensures accurate and efficient kitting of components and assemblies, optimized packaging for safe and secure transportation, and reliable warehousing to store your products until they are ready to be shipped.',
      },
      {
        title: 'Web-Sale End-Customer Fulfillment',
        description:
          'We handle web-sale end-customer fulfillment, catering to the growing e-commerce market. Our systems and processes are designed to meet the demands of this dynamic environment.',
      },
      {
        title: 'EDI Fulfillment for Big-Box Retailers',
        description:
          'For clients supplying big-box retailers, we offer Electronic Data Interchange (EDI) fulfillment services. We are well-versed in the specific requirements of big-box retailers and can efficiently handle EDI transactions, ensuring compliance with their standards.',
      },
      {
        title: 'Low-Volume Pilot-Production through High-Volume Mass Production Builds',
        description:
          'Whether you have low-volume pilot production or high-volume mass production builds, our fulfillment services are flexible and scalable to meet your needs and deliver products to market quickly and efficiently.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}
