import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// ─── Models ───────────────────────────────────────────────────────────────────
import userModel from "../src/models/user.model.js";
import exhibitorProfileModel from "../src/models/exhibitorProfile.model.js";
import expoModel from "../src/models/expo.model.js";
import boothModel from "../src/models/booth.model.js";
import boothVisitModel from "../src/models/boothVisit.model.js";
import scheduleModel from "../src/models/schedule.model.js";
import attendeeRegistrationModel from "../src/models/attendeeRegistration.model.js";
import inquiryModel from "../src/models/inquiry.model.js";
import notificationModel from "../src/models/notification.model.js";

// ─── DB Connect ───────────────────────────────────────────────────────────────
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected");

// ─── Admin User ───────────────────────────────────────────────────────────────
const adminUser = await userModel.findOne({ role: "admin" });
if (!adminUser) {
  console.error("❌ No admin user found. Run `npm run seed:admin` first.");
  await mongoose.disconnect();
  process.exit(1);
}
const adminId = adminUser._id;
console.log(`🔑 Using admin: ${adminUser.email}`);

// ─── Cleanup ──────────────────────────────────────────────────────────────────
await Promise.all([
  userModel.deleteMany({ role: { $in: ["exhibitor", "attendee"] } }),
  exhibitorProfileModel.deleteMany({}),
  expoModel.deleteMany({}),
  boothModel.deleteMany({}),
  boothVisitModel.deleteMany({}),
  scheduleModel.deleteMany({}),
  attendeeRegistrationModel.deleteMany({}),
  inquiryModel.deleteMany({}),
  notificationModel.deleteMany({}),
]);
console.log("🧹 Old seed data cleared");

// ─── Password Hash ────────────────────────────────────────────────────────────
const passwordHash = await bcrypt.hash("Seed@1234", 10);

// ─── Exhibitor Users ──────────────────────────────────────────────────────────
const exhibitorUsersData = [
  { name: "Ahmed Raza", email: "ahmed.raza@techvista.com" },
  { name: "Sara Malik", email: "sara.malik@greenleaf.io" },
  { name: "Bilal Hussain", email: "bilal.hussain@nexuslogic.pk" },
  { name: "Fatima Zahra", email: "fatima.zahra@arenasoft.com" },
  { name: "Omar Sheikh", email: "omar.sheikh@cloudbridge.net" },
  { name: "Zara Khan", email: "zara.khan@pixelstorm.pk" },
  { name: "Hamza Iqbal", email: "hamza.iqbal@devcraft.io" },
  { name: "Nadia Siddiqui", email: "nadia.siddiqui@datawaves.com" },
  { name: "Usman Tariq", email: "usman.tariq@smartedge.pk" },
  { name: "Ayesha Farooq", email: "ayesha.farooq@futurehive.com" },
  { name: "Kamran Butt", email: "kamran.butt@codelink.io" },
  { name: "Sana Javed", email: "sana.javed@softbridge.pk" },
];

const exhibitorUsers = await userModel.insertMany(
  exhibitorUsersData.map((u) => ({
    ...u,
    role: "exhibitor",
    passwordHash,
    isVerified: true,
  }))
);
console.log(`👔 ${exhibitorUsers.length} exhibitor users created`);

// ─── Attendee Users ───────────────────────────────────────────────────────────
const attendeeUsersData = [
  { name: "Ali Hassan", email: "ali.hassan@gmail.com" },
  { name: "Maryam Akhtar", email: "maryam.akhtar@gmail.com" },
  { name: "Rahim Chaudhry", email: "rahim.chaudhry@outlook.com" },
  { name: "Hina Baig", email: "hina.baig@yahoo.com" },
  { name: "Saad Mehmood", email: "saad.mehmood@gmail.com" },
  { name: "Laiba Riaz", email: "laiba.riaz@hotmail.com" },
  { name: "Faisal Nawaz", email: "faisal.nawaz@gmail.com" },
  { name: "Amna Qureshi", email: "amna.qureshi@outlook.com" },
  { name: "Tariq Anwar", email: "tariq.anwar@gmail.com" },
  { name: "Sobia Khalil", email: "sobia.khalil@yahoo.com" },
  { name: "Imran Yousuf", email: "imran.yousuf@gmail.com" },
  { name: "Rabia Saleem", email: "rabia.saleem@gmail.com" },
  { name: "Zain Ul Abdin", email: "zain.abdin@outlook.com" },
  { name: "Madiha Noor", email: "madiha.noor@gmail.com" },
  { name: "Adnan Mirza", email: "adnan.mirza@hotmail.com" },
  { name: "Shaheena Parveen", email: "shaheena.p@gmail.com" },
  { name: "Waqar Ahmed", email: "waqar.ahmed@gmail.com" },
  { name: "Bushra Malik", email: "bushra.malik@yahoo.com" },
];

const attendeeUsers = await userModel.insertMany(
  attendeeUsersData.map((u) => ({
    ...u,
    role: "attendee",
    passwordHash,
    isVerified: true,
  }))
);
console.log(`🙋 ${attendeeUsers.length} attendee users created`);

// ─── Exhibitor Profiles ───────────────────────────────────────────────────────
const profilesData = [
  {
    userId: exhibitorUsers[0]._id,
    companyName: "TechVista Solutions",
    industry: "Information Technology",
    description: "We provide cutting-edge enterprise software solutions for large-scale organizations across Pakistan and the Middle East.",
    website: "https://techvista.com",
    contactPerson: "Ahmed Raza",
    contactPhone: "0300-1234567",
    productsServices: "ERP Systems, Custom Software Development, Cloud Migration",
    documents: ["https://docs.techvista.com/ntn.pdf", "https://docs.techvista.com/reg.pdf"],
    logo: "https://techvista.com/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-01-10"),
    reviewedAt: new Date("2025-01-12"),
  },
  {
    userId: exhibitorUsers[1]._id,
    companyName: "GreenLeaf Innovations",
    industry: "AgriTech",
    description: "Pioneering smart farming solutions using IoT and AI to help farmers increase yield and reduce waste.",
    website: "https://greenleaf.io",
    contactPerson: "Sara Malik",
    contactPhone: "0321-9876543",
    productsServices: "Smart Irrigation Systems, Crop Monitoring Drones, Soil Sensors",
    documents: ["https://docs.greenleaf.io/cert.pdf"],
    logo: "https://greenleaf.io/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-01-11"),
    reviewedAt: new Date("2025-01-13"),
  },
  {
    userId: exhibitorUsers[2]._id,
    companyName: "Nexus Logic",
    industry: "Cybersecurity",
    description: "Providing enterprise-grade cybersecurity services including penetration testing, SOC services, and compliance consulting.",
    website: "https://nexuslogic.pk",
    contactPerson: "Bilal Hussain",
    contactPhone: "0333-5556677",
    productsServices: "Penetration Testing, SOC as a Service, ISO 27001 Compliance",
    documents: ["https://nexuslogic.pk/docs/ntn.pdf", "https://nexuslogic.pk/docs/secp.pdf"],
    logo: "https://nexuslogic.pk/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-01-14"),
    reviewedAt: new Date("2025-01-15"),
  },
  {
    userId: exhibitorUsers[3]._id,
    companyName: "Arena Soft",
    industry: "Mobile Development",
    description: "Award-winning mobile app development agency specializing in Flutter and React Native cross-platform applications.",
    website: "https://arenasoft.com",
    contactPerson: "Fatima Zahra",
    contactPhone: "0311-7778899",
    productsServices: "iOS Development, Android Development, UX Design, QA Testing",
    documents: ["https://arenasoft.com/docs/cert.pdf"],
    logo: "https://arenasoft.com/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-01-16"),
    reviewedAt: new Date("2025-01-17"),
  },
  {
    userId: exhibitorUsers[4]._id,
    companyName: "CloudBridge Networks",
    industry: "Cloud Computing",
    description: "Helping businesses migrate to the cloud with zero downtime. AWS and Azure certified partners.",
    website: "https://cloudbridge.net",
    contactPerson: "Omar Sheikh",
    contactPhone: "0345-2223344",
    productsServices: "Cloud Architecture, DevOps Pipelines, Managed Kubernetes, 24/7 Support",
    documents: ["https://cloudbridge.net/docs/ntn.pdf"],
    logo: "https://cloudbridge.net/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-01-18"),
    reviewedAt: new Date("2025-01-19"),
  },
  {
    userId: exhibitorUsers[5]._id,
    companyName: "PixelStorm Studio",
    industry: "Digital Marketing",
    description: "Full-service digital marketing agency helping brands grow through SEO, social media, and performance advertising.",
    website: "https://pixelstorm.pk",
    contactPerson: "Zara Khan",
    contactPhone: "0312-4445566",
    productsServices: "SEO, Google Ads, Social Media Management, Content Creation",
    documents: ["https://pixelstorm.pk/docs/cert.pdf", "https://pixelstorm.pk/docs/tax.pdf"],
    logo: "https://pixelstorm.pk/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-02-01"),
    reviewedAt: new Date("2025-02-02"),
  },
  {
    userId: exhibitorUsers[6]._id,
    companyName: "DevCraft Labs",
    industry: "Software Development",
    description: "Boutique software development studio specializing in MERN stack, GraphQL APIs, and real-time applications.",
    website: "https://devcraft.io",
    contactPerson: "Hamza Iqbal",
    contactPhone: "0323-6667788",
    productsServices: "Web Applications, REST APIs, GraphQL, Real-time Systems",
    documents: ["https://devcraft.io/docs/ntn.pdf"],
    logo: "https://devcraft.io/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-02-05"),
    reviewedAt: new Date("2025-02-06"),
  },
  {
    userId: exhibitorUsers[7]._id,
    companyName: "DataWaves Analytics",
    industry: "Data Science",
    description: "Transforming raw business data into actionable insights through machine learning models and interactive dashboards.",
    website: "https://datawaves.com",
    contactPerson: "Nadia Siddiqui",
    contactPhone: "0300-9990011",
    productsServices: "Business Intelligence, ML Models, Data Pipelines, Power BI Dashboards",
    documents: ["https://datawaves.com/docs/cert.pdf"],
    logo: "https://datawaves.com/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-02-08"),
    reviewedAt: new Date("2025-02-09"),
  },
  {
    userId: exhibitorUsers[8]._id,
    companyName: "SmartEdge Technologies",
    industry: "IoT & Embedded Systems",
    description: "Building smart embedded systems and IoT products for industrial automation and smart home markets.",
    website: "https://smartedge.pk",
    contactPerson: "Usman Tariq",
    contactPhone: "0336-1112233",
    productsServices: "IoT Devices, Firmware Development, Industrial Automation, PCB Design",
    documents: ["https://smartedge.pk/docs/cert.pdf", "https://smartedge.pk/docs/ntn.pdf"],
    logo: "https://smartedge.pk/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-02-10"),
    reviewedAt: new Date("2025-02-11"),
  },
  {
    userId: exhibitorUsers[9]._id,
    companyName: "FutureHive EdTech",
    industry: "Education Technology",
    description: "Online learning platform offering professional certifications in tech, business, and design with 50,000+ enrolled students.",
    website: "https://futurehive.com",
    contactPerson: "Ayesha Farooq",
    contactPhone: "0344-3334455",
    productsServices: "Online Courses, Live Bootcamps, Corporate Training, Certification Programs",
    documents: ["https://futurehive.com/docs/registration.pdf"],
    logo: "https://futurehive.com/logo.png",
    approvalStatus: "approved",
    onboardingComplete: true,
    submittedAt: new Date("2025-02-12"),
    reviewedAt: new Date("2025-02-13"),
  },
  {
    userId: exhibitorUsers[10]._id,
    companyName: "CodeLink Systems",
    industry: "Enterprise Solutions",
    description: "Delivering end-to-end enterprise solutions including CRM, HRMS, and supply chain management systems.",
    website: "https://codelink.io",
    contactPerson: "Kamran Butt",
    contactPhone: "0301-5556677",
    productsServices: "CRM, HRMS, Supply Chain Management, ERP Integration",
    documents: ["https://codelink.io/docs/cert.pdf"],
    logo: "https://codelink.io/logo.png",
    approvalStatus: "pending",
    onboardingComplete: true,
    submittedAt: new Date("2025-03-01"),
  },
  {
    userId: exhibitorUsers[11]._id,
    companyName: "SoftBridge Technologies",
    industry: "FinTech",
    description: "Building next-generation payment infrastructure and digital banking solutions for emerging markets.",
    website: "https://softbridge.pk",
    contactPerson: "Sana Javed",
    contactPhone: "0315-7778899",
    productsServices: "Payment Gateway, Digital Wallets, Open Banking APIs, KYC Solutions",
    documents: ["https://softbridge.pk/docs/secp.pdf", "https://softbridge.pk/docs/sbp.pdf"],
    logo: "https://softbridge.pk/logo.png",
    approvalStatus: "rejected",
    approvalNote: "Incomplete regulatory documentation. Please provide updated SBP license.",
    onboardingComplete: true,
    submittedAt: new Date("2025-02-20"),
    reviewedAt: new Date("2025-02-22"),
  },
];

const profiles = await exhibitorProfileModel.insertMany(profilesData);
console.log(`🏢 ${profiles.length} exhibitor profiles created`);

// ─── Expos ────────────────────────────────────────────────────────────────────
const exposData = [
  {
    title: "Pakistan Tech Summit 2025",
    date: new Date("2025-04-15"),
    location: "Expo Centre Karachi, Hall A",
    description: "The largest technology expo in Pakistan bringing together startups, enterprises, and innovators from across the country.",
    theme: "Innovation Without Borders",
    status: "published",
    createdBy: adminId,
  },
  {
    title: "Digital Pakistan Expo",
    date: new Date("2025-05-20"),
    location: "Pakistan National Council of Arts, Islamabad",
    description: "A flagship national event promoting digital transformation across government, education, and private sectors.",
    theme: "Digitizing the Nation",
    status: "published",
    createdBy: adminId,
  },
  {
    title: "FinTech & Banking Forum 2025",
    date: new Date("2025-06-10"),
    location: "Pearl Continental Hotel, Lahore",
    description: "Premier gathering of financial technology companies, banks, and regulators shaping the future of finance in South Asia.",
    theme: "The Future of Money",
    status: "published",
    createdBy: adminId,
  },
  {
    title: "AgriTech Innovation Fair",
    date: new Date("2025-07-05"),
    location: "Faisalabad Expo Centre",
    description: "Showcasing groundbreaking agricultural technologies helping farmers increase productivity and sustainability.",
    theme: "Smart Farming for a Hungry World",
    status: "published",
    createdBy: adminId,
  },
  {
    title: "Startup Pakistan Expo 2025",
    date: new Date("2025-08-18"),
    location: "NUST University, Islamabad",
    description: "Pakistan's most energetic startup ecosystem event connecting founders, investors, mentors, and corporate sponsors.",
    theme: "Build. Scale. Impact.",
    status: "draft",
    createdBy: adminId,
  },
];

const expos = await expoModel.insertMany(exposData);
console.log(`🎪 ${expos.length} expos created`);

// ─── Booths ───────────────────────────────────────────────────────────────────
// Helper: pick approved profiles only (first 10)
const approvedProfiles = profiles.filter((p) => p.approvalStatus === "approved");

const boothsData = [
  // Expo 0 — Pakistan Tech Summit (6 booths)
  { expoId: expos[0]._id, boothNumber: "A-01", size: "large", status: "assigned", assignedTo: approvedProfiles[0]._id },
  { expoId: expos[0]._id, boothNumber: "A-02", size: "medium", status: "assigned", assignedTo: approvedProfiles[1]._id },
  { expoId: expos[0]._id, boothNumber: "A-03", size: "large", status: "assigned", assignedTo: approvedProfiles[2]._id },
  { expoId: expos[0]._id, boothNumber: "A-04", size: "small", status: "reserved", assignedTo: approvedProfiles[3]._id },
  { expoId: expos[0]._id, boothNumber: "A-05", size: "medium", status: "available", assignedTo: null },
  { expoId: expos[0]._id, boothNumber: "A-06", size: "small", status: "available", assignedTo: null },

  // Expo 1 — Digital Pakistan Expo (6 booths)
  { expoId: expos[1]._id, boothNumber: "B-01", size: "large", status: "assigned", assignedTo: approvedProfiles[4]._id },
  { expoId: expos[1]._id, boothNumber: "B-02", size: "medium", status: "assigned", assignedTo: approvedProfiles[5]._id },
  { expoId: expos[1]._id, boothNumber: "B-03", size: "large", status: "assigned", assignedTo: approvedProfiles[6]._id },
  { expoId: expos[1]._id, boothNumber: "B-04", size: "medium", status: "reserved", assignedTo: approvedProfiles[7]._id },
  { expoId: expos[1]._id, boothNumber: "B-05", size: "small", status: "available", assignedTo: null },
  { expoId: expos[1]._id, boothNumber: "B-06", size: "small", status: "available", assignedTo: null },

  // Expo 2 — FinTech & Banking Forum (5 booths)
  { expoId: expos[2]._id, boothNumber: "C-01", size: "large", status: "assigned", assignedTo: approvedProfiles[8]._id },
  { expoId: expos[2]._id, boothNumber: "C-02", size: "large", status: "assigned", assignedTo: approvedProfiles[9]._id },
  { expoId: expos[2]._id, boothNumber: "C-03", size: "medium", status: "assigned", assignedTo: approvedProfiles[0]._id },
  { expoId: expos[2]._id, boothNumber: "C-04", size: "small", status: "available", assignedTo: null },
  { expoId: expos[2]._id, boothNumber: "C-05", size: "small", status: "available", assignedTo: null },

  // Expo 3 — AgriTech Innovation Fair (5 booths)
  { expoId: expos[3]._id, boothNumber: "D-01", size: "large", status: "assigned", assignedTo: approvedProfiles[1]._id },
  { expoId: expos[3]._id, boothNumber: "D-02", size: "medium", status: "assigned", assignedTo: approvedProfiles[2]._id },
  { expoId: expos[3]._id, boothNumber: "D-03", size: "medium", status: "reserved", assignedTo: approvedProfiles[3]._id },
  { expoId: expos[3]._id, boothNumber: "D-04", size: "small", status: "available", assignedTo: null },
  { expoId: expos[3]._id, boothNumber: "D-05", size: "small", status: "available", assignedTo: null },

  // Expo 4 — Startup Pakistan (4 booths, draft expo)
  { expoId: expos[4]._id, boothNumber: "E-01", size: "medium", status: "available", assignedTo: null },
  { expoId: expos[4]._id, boothNumber: "E-02", size: "medium", status: "available", assignedTo: null },
  { expoId: expos[4]._id, boothNumber: "E-03", size: "small", status: "available", assignedTo: null },
  { expoId: expos[4]._id, boothNumber: "E-04", size: "large", status: "reserved", assignedTo: approvedProfiles[4]._id },
];

const booths = await boothModel.insertMany(boothsData);
console.log(`🏪 ${booths.length} booths created`);

// ─── Schedule / Sessions ──────────────────────────────────────────────────────
const sessionsData = [
  // Expo 0 — Pakistan Tech Summit
  { expoId: expos[0]._id, topic: "Opening Keynote: Pakistan's Tech Decade", speaker: "Dr. Umar Saif", location: "Main Stage", startTime: new Date("2025-04-15T09:00:00"), endTime: new Date("2025-04-15T10:00:00") },
  { expoId: expos[0]._id, topic: "Building Scalable SaaS Products", speaker: "Ahmed Raza, TechVista", location: "Hall A - Room 1", startTime: new Date("2025-04-15T10:30:00"), endTime: new Date("2025-04-15T11:30:00") },
  { expoId: expos[0]._id, topic: "Cybersecurity in the Age of AI", speaker: "Bilal Hussain, Nexus Logic", location: "Hall A - Room 2", startTime: new Date("2025-04-15T12:00:00"), endTime: new Date("2025-04-15T13:00:00") },
  { expoId: expos[0]._id, topic: "From Idea to IPO: A Founder's Journey", speaker: "Panel: 4 Startup Founders", location: "Main Stage", startTime: new Date("2025-04-15T14:00:00"), endTime: new Date("2025-04-15T15:30:00") },
  { expoId: expos[0]._id, topic: "Cloud-Native Architecture Workshop", speaker: "Omar Sheikh, CloudBridge", location: "Workshop Room", startTime: new Date("2025-04-15T16:00:00"), endTime: new Date("2025-04-15T17:30:00") },

  // Expo 1 — Digital Pakistan Expo
  { expoId: expos[1]._id, topic: "Digital Transformation in Government", speaker: "Ministry of IT Representative", location: "Auditorium", startTime: new Date("2025-05-20T09:00:00"), endTime: new Date("2025-05-20T10:00:00") },
  { expoId: expos[1]._id, topic: "E-Commerce Boom: Trends & Opportunities", speaker: "Zara Khan, PixelStorm", location: "Hall B - Room 1", startTime: new Date("2025-05-20T10:30:00"), endTime: new Date("2025-05-20T11:30:00") },
  { expoId: expos[1]._id, topic: "Building Pakistan's Data Economy", speaker: "Nadia Siddiqui, DataWaves", location: "Hall B - Room 2", startTime: new Date("2025-05-20T12:00:00"), endTime: new Date("2025-05-20T13:00:00") },
  { expoId: expos[1]._id, topic: "AI in Education: The FutureHive Story", speaker: "Ayesha Farooq, FutureHive", location: "Auditorium", startTime: new Date("2025-05-20T14:00:00"), endTime: new Date("2025-05-20T15:00:00") },
  { expoId: expos[1]._id, topic: "Mobile-First Pakistan: App Development Trends", speaker: "Fatima Zahra, Arena Soft", location: "Workshop Room", startTime: new Date("2025-05-20T15:30:00"), endTime: new Date("2025-05-20T17:00:00") },

  // Expo 2 — FinTech & Banking Forum
  { expoId: expos[2]._id, topic: "SBP's Digital Banking Vision 2030", speaker: "SBP Governor's Representative", location: "Grand Ballroom", startTime: new Date("2025-06-10T09:00:00"), endTime: new Date("2025-06-10T10:00:00") },
  { expoId: expos[2]._id, topic: "Open Banking APIs: Opportunities for Developers", speaker: "Hamza Iqbal, DevCraft", location: "Conference Room 1", startTime: new Date("2025-06-10T10:30:00"), endTime: new Date("2025-06-10T11:30:00") },
  { expoId: expos[2]._id, topic: "KYC & AML Compliance in Digital Finance", speaker: "Legal Compliance Expert", location: "Conference Room 2", startTime: new Date("2025-06-10T12:00:00"), endTime: new Date("2025-06-10T13:00:00") },
  { expoId: expos[2]._id, topic: "Crypto & Blockchain: Pakistan's Stance", speaker: "Panel Discussion", location: "Grand Ballroom", startTime: new Date("2025-06-10T14:00:00"), endTime: new Date("2025-06-10T15:30:00") },

  // Expo 3 — AgriTech Fair
  { expoId: expos[3]._id, topic: "Smart Irrigation: Saving Water, Doubling Yield", speaker: "Sara Malik, GreenLeaf", location: "Main Pavilion", startTime: new Date("2025-07-05T09:00:00"), endTime: new Date("2025-07-05T10:00:00") },
  { expoId: expos[3]._id, topic: "Drone-Based Crop Monitoring in Pakistan", speaker: "Dr. Khurram Iqbal, NARC", location: "Main Pavilion", startTime: new Date("2025-07-05T10:30:00"), endTime: new Date("2025-07-05T11:30:00") },
  { expoId: expos[3]._id, topic: "IoT Soil Sensors: Live Demo", speaker: "Usman Tariq, SmartEdge", location: "Demo Area", startTime: new Date("2025-07-05T12:00:00"), endTime: new Date("2025-07-05T13:00:00") },
  { expoId: expos[3]._id, topic: "AgriFinance: Loans for Small Farmers", speaker: "Zarai Taraqiati Bank", location: "Conference Room", startTime: new Date("2025-07-05T14:00:00"), endTime: new Date("2025-07-05T15:00:00") },

  // Expo 4 — Startup Pakistan (draft, fewer sessions)
  { expoId: expos[4]._id, topic: "Startup Funding 101: Seed to Series A", speaker: "VC Panel", location: "Auditorium", startTime: new Date("2025-08-18T09:00:00"), endTime: new Date("2025-08-18T10:30:00") },
  { expoId: expos[4]._id, topic: "Building MVPs Fast with AI Tools", speaker: "Hamza Iqbal, DevCraft", location: "Workshop Room", startTime: new Date("2025-08-18T11:00:00"), endTime: new Date("2025-08-18T12:30:00") },
  { expoId: expos[4]._id, topic: "Pitch Competition Finals", speaker: "8 Selected Startups", location: "Main Stage", startTime: new Date("2025-08-18T14:00:00"), endTime: new Date("2025-08-18T17:00:00") },
];

const sessions = await scheduleModel.insertMany(sessionsData);
console.log(`📅 ${sessions.length} sessions created`);

// ─── Attendee Registrations ───────────────────────────────────────────────────
// Group sessions by expo for easy bookmark assignment
const sessionsByExpo = {};
for (const session of sessions) {
  const key = session.expoId.toString();
  if (!sessionsByExpo[key]) sessionsByExpo[key] = [];
  sessionsByExpo[key].push(session._id);
}

const registrationsData = [];

// Each attendee registers for 2-4 expos
const expoAssignments = [
  [0, 1, 2],       // Ali Hassan
  [0, 1, 3],       // Maryam Akhtar
  [0, 2, 4],       // Rahim Chaudhry
  [1, 2, 3],       // Hina Baig
  [0, 1, 2, 3],    // Saad Mehmood
  [2, 3, 4],       // Laiba Riaz
  [0, 3],          // Faisal Nawaz
  [1, 2],          // Amna Qureshi
  [0, 1, 4],       // Tariq Anwar
  [2, 3],          // Sobia Khalil
  [0, 1, 2, 3],    // Imran Yousuf
  [1, 3, 4],       // Rabia Saleem
  [0, 2],          // Zain Ul Abdin
  [1, 2, 3],       // Madiha Noor
  [0, 4],          // Adnan Mirza
  [1, 3],          // Shaheena Parveen
  [0, 1, 2],       // Waqar Ahmed
  [2, 3, 4],       // Bushra Malik
];

for (let i = 0; i < attendeeUsers.length; i++) {
  const expoIndices = expoAssignments[i] || [0, 1];
  for (const expoIdx of expoIndices) {
    const expoId = expos[expoIdx]._id;
    const expoSessions = sessionsByExpo[expoId.toString()] || [];
    // Bookmark 1-3 random sessions from that expo
    const numBookmarks = Math.min(expoSessions.length, Math.floor(Math.random() * 3) + 1);
    const bookmarkedSessions = expoSessions.slice(0, numBookmarks);
    registrationsData.push({
      user: attendeeUsers[i]._id,
      expo: expoId,
      bookmarkedSessions,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    });
  }
}

const registrations = await attendeeRegistrationModel.insertMany(registrationsData);
console.log(`✅ ${registrations.length} attendee registrations created`);

// ─── Booth Visits ─────────────────────────────────────────────────────────────
// Filter booths that are assigned/reserved (meaningful to visit)
const assignedBooths = booths.filter((b) => b.status === "assigned" || b.status === "reserved");

const boothVisitsData = [];
const visitSet = new Set(); // prevent duplicates

for (const registration of registrations) {
  const expoBooths = assignedBooths.filter(
    (b) => b.expoId.toString() === registration.expo.toString()
  );

  // Each attendee visits 1-3 booths per expo
  const numVisits = Math.min(expoBooths.length, Math.floor(Math.random() * 3) + 1);
  for (let i = 0; i < numVisits; i++) {
    const booth = expoBooths[i];
    if (!booth) continue;
    const key = `${registration.user}-${booth._id}`;
    if (visitSet.has(key)) continue;
    visitSet.add(key);
    boothVisitsData.push({
      attendee: registration.user,
      expoId: registration.expo,
      boothId: booth._id,
      visitedAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
    });
  }
}

const boothVisits = await boothVisitModel.insertMany(boothVisitsData);
console.log(`👣 ${boothVisits.length} booth visits recorded`);

// ─── Inquiries ────────────────────────────────────────────────────────────────
const inquiriesData = [
  {
    sender: attendeeUsers[0]._id,
    recipient: null,
    expoId: expos[0]._id,
    subject: "Parking arrangements for Tech Summit",
    message: "Hi, I wanted to ask about the parking situation at the Expo Centre Karachi for the Tech Summit. Is there dedicated parking for attendees?",
    type: "admin_support",
    status: "replied",
    adminReply: "Yes, there is ample parking available at the Expo Centre. We recommend arriving early as spaces fill up quickly. Parking is free for all registered attendees.",
  },
  {
    sender: attendeeUsers[1]._id,
    recipient: null,
    expoId: expos[0]._id,
    subject: "Certificate of attendance",
    message: "Will there be a digital certificate of attendance issued after the expo?",
    type: "admin_support",
    status: "replied",
    adminReply: "Yes! Digital certificates will be emailed to all attendees within 3 business days after the expo concludes.",
  },
  {
    sender: attendeeUsers[2]._id,
    recipient: exhibitorUsers[0]._id,
    expoId: expos[0]._id,
    subject: "Partnership inquiry with TechVista",
    message: "Hello, I represent a mid-size manufacturing company and we are exploring ERP solutions. I came across TechVista and would love to schedule a demo during or after the expo.",
    type: "exhibitor_network",
    status: "unread",
  },
  {
    sender: attendeeUsers[3]._id,
    recipient: exhibitorUsers[1]._id,
    expoId: expos[3]._id,
    subject: "GreenLeaf smart irrigation pricing",
    message: "We are a farming cooperative with 500 acres. Can you share pricing and setup timelines for your smart irrigation system?",
    type: "exhibitor_network",
    status: "unread",
  },
  {
    sender: attendeeUsers[4]._id,
    recipient: null,
    expoId: expos[1]._id,
    subject: "Stall availability for small businesses",
    message: "Are there any subsidized stalls available for small businesses or solo entrepreneurs at the Digital Pakistan Expo?",
    type: "admin_support",
    status: "unread",
  },
  {
    sender: attendeeUsers[5]._id,
    recipient: exhibitorUsers[4]._id,
    expoId: expos[1]._id,
    subject: "Cloud migration consultation",
    message: "We are a 50-person software house and planning to migrate our on-premise infrastructure to AWS. Would CloudBridge be able to consult us on this?",
    type: "exhibitor_network",
    status: "unread",
  },
  {
    sender: attendeeUsers[6]._id,
    recipient: null,
    expoId: expos[2]._id,
    subject: "Press / media registration for FinTech Forum",
    message: "I am a financial journalist covering the FinTech space. Is there a press registration process for the FinTech & Banking Forum?",
    type: "admin_support",
    status: "replied",
    adminReply: "Please email press@fintech-forum.pk with your credentials and publication name. We will process your press pass within 48 hours.",
  },
  {
    sender: attendeeUsers[7]._id,
    recipient: exhibitorUsers[6]._id,
    expoId: expos[0]._id,
    subject: "MERN stack project collaboration",
    message: "Hi DevCraft team! We have a startup building a logistics management platform and are looking for a development partner. Would love to connect at the Tech Summit.",
    type: "exhibitor_network",
    status: "unread",
  },
  {
    sender: attendeeUsers[8]._id,
    recipient: null,
    expoId: expos[4]._id,
    subject: "Startup pitching slots availability",
    message: "How do we apply for the pitching competition at the Startup Pakistan Expo? Is there a deadline?",
    type: "admin_support",
    status: "unread",
  },
  {
    sender: attendeeUsers[9]._id,
    recipient: exhibitorUsers[7]._id,
    expoId: expos[1]._id,
    subject: "Data analytics for retail chain",
    message: "We operate a chain of 20 retail stores and want to implement a business intelligence dashboard. Can DataWaves help us? Looking forward to your demo session.",
    type: "exhibitor_network",
    status: "unread",
  },
];

const inquiries = await inquiryModel.insertMany(inquiriesData);
console.log(`📨 ${inquiries.length} inquiries created`);

// ─── Notifications ────────────────────────────────────────────────────────────
const notificationsData = [];

// Approval notifications for approved exhibitors
for (const profile of approvedProfiles.slice(0, 10)) {
  notificationsData.push({
    userId: profile.userId,
    type: "application_update",
    title: "Application approved",
    message: "Your exhibitor application has been approved. You can now access the exhibitor portal and manage your booth.",
    metadata: { exhibitorProfileId: profile._id },
    readAt: new Date(),
  });
}

// Booth assignment notifications
const assignedBoothsFull = booths.filter((b) => b.status === "assigned");
for (const booth of assignedBoothsFull) {
  const profile = approvedProfiles.find(
    (p) => p._id.toString() === booth.assignedTo?.toString()
  );
  if (!profile) continue;
  notificationsData.push({
    userId: profile.userId,
    expoId: booth.expoId,
    type: "booth_update",
    title: "Booth assigned",
    message: `Booth ${booth.boothNumber} has been assigned to your company.`,
    metadata: { boothId: booth._id },
    readAt: new Date(),
  });
}

// Schedule reminder notifications for attendees (bookmarked sessions)
for (const reg of registrations.slice(0, 12)) {
  for (const sessionId of reg.bookmarkedSessions.slice(0, 1)) {
    const session = sessions.find((s) => s._id.toString() === sessionId.toString());
    if (!session) continue;
    notificationsData.push({
      userId: reg.user,
      expoId: reg.expo,
      type: "schedule_reminder",
      title: "Session bookmarked",
      message: `${session.topic} has been added to your schedule reminders.`,
      metadata: { sessionId: session._id, startTime: session.startTime },
      readAt: Math.random() > 0.5 ? new Date() : null,
    });
  }
}

// Inquiry notifications
notificationsData.push({
  userId: exhibitorUsers[0]._id,
  expoId: expos[0]._id,
  type: "inquiry",
  title: "New inquiry received",
  message: "Partnership inquiry with TechVista",
  metadata: { inquiryId: inquiries[2]._id },
  readAt: null,
});
notificationsData.push({
  userId: exhibitorUsers[1]._id,
  expoId: expos[3]._id,
  type: "inquiry",
  title: "New inquiry received",
  message: "GreenLeaf smart irrigation pricing",
  metadata: { inquiryId: inquiries[3]._id },
  readAt: null,
});

// Support reply notification
notificationsData.push({
  userId: attendeeUsers[0]._id,
  expoId: expos[0]._id,
  type: "support_reply",
  title: "Support inquiry replied",
  message: "An organizer has replied to your inquiry about parking arrangements.",
  metadata: { inquiryId: inquiries[0]._id },
  readAt: new Date(),
});

const notifications = await notificationModel.insertMany(notificationsData);
console.log(`🔔 ${notifications.length} notifications created`);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n══════════════════════════════════════════");
console.log("🌱 SEED COMPLETE");
console.log("══════════════════════════════════════════");
console.log(`  Exhibitor Users  : ${exhibitorUsers.length}`);
console.log(`  Attendee Users   : ${attendeeUsers.length}`);
console.log(`  Exhibitor Profiles: ${profiles.length} (10 approved, 1 pending, 1 rejected)`);
console.log(`  Expos            : ${expos.length} (4 published, 1 draft)`);
console.log(`  Booths           : ${booths.length}`);
console.log(`  Sessions         : ${sessions.length}`);
console.log(`  Registrations    : ${registrations.length}`);
console.log(`  Booth Visits     : ${boothVisits.length}`);
console.log(`  Inquiries        : ${inquiries.length}`);
console.log(`  Notifications    : ${notifications.length}`);
console.log("══════════════════════════════════════════");
console.log("\n🔑 All users password: Seed@1234");
console.log("📧 Email format: [name]@[company].com\n");

await mongoose.disconnect();