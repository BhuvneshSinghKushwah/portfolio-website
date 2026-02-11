-- Seed data from Bhuvnesh Singh Kushwah's CV
-- Run this after schema.sql to populate initial portfolio content.

-- Personal Info
INSERT INTO personal_info (full_name, title, bio, email, phone, linkedin_url, github_url, resume_url) VALUES (
  'Bhuvnesh Singh Kushwah',
  'Backend Engineer',
  'Backend Engineer specializing in scalable systems, microservices architecture, and cloud infrastructure. Experienced with Python, TypeScript, Go, Docker, Kubernetes, and AWS. Passionate about building high-performance backend services and automation tools.',
  'official.bhuvneshsingh@gmail.com',
  '+91 8770428395',
  'https://linkedin.com/in/bhuvnesh-singh-kushwah',
  'https://github.com/bhuvnesh-singh-kushwah',
  '/resume.pdf'
);

-- Experiences
INSERT INTO experiences (company, role, start_date, end_date, description, sort_order) VALUES
(
  'Sendcrux.ai',
  'Backend Engineer',
  'May 2025',
  'Sept 2025',
  ARRAY[
    'Designed and deployed an in-house Python-based AI Voice Agent utilizing WebRTC and custom TTS/ASR pipelines—eliminating vendor costs and increasing system control.',
    'Engineered a scalable, undetectable headless browser automation framework (Selenium + Custom Chromium Patches) to bypass detection, boosting domain reputation to 90%+ on Gmail/Workspace.',
    'Architected and deployed high-throughput Microservices on Docker + Kubernetes, significantly improving system reliability, horizontal scalability, and throughput for internal automation tools.'
  ],
  0
),
(
  'Personaliz.ai',
  'Backend Engineer',
  'Jan 2023',
  'April 2025',
  ARRAY[
    'Built and optimized asynchronous workflow pipelines using Celery/BullMQ for large dataset processing, third-party integrations, and automated data enrichment, enhancing system reliability.',
    'Collaborated with ML and Product teams to design scalable backend architecture, ensuring high availability and consistent performance for user-facing services.',
    'Optimized database performance via MySQL indexing, query tuning, schema normalization, and slow-query analysis, reducing data retrieval latency and significantly improving API efficiency.'
  ],
  1
),
(
  'Persistent Systems',
  'Summer Martian Internship',
  'Sep 2023',
  'Oct 2023',
  ARRAY[
    'Gained foundational expertise in robust System Design, complex debugging, and backend service development through mentor-led, real-world projects.'
  ],
  2
),
(
  'Summer Of Bitcoin 2023',
  'Blockchain Developer Internship',
  'May 2023',
  'Nov 2023',
  ARRAY[
    'Actively contributed to the open-source BitcoinJS ecosystem, enhancing BIP39 JavaScript libraries and improving wallet-related functionality and code quality.'
  ],
  3
);

-- Projects
INSERT INTO projects (name, tagline, description, github_url, tech_tags, year, sort_order) VALUES
(
  'Lipsync-Diffusion-Model',
  'Enhanced fork with Apple Silicon (MPS) support',
  'Implemented core audio-to-mouth prediction pipeline (mel-spectrograms to face decoder). Added Real-ESRGAN, GFPGAN, and Stable Diffusion inpainting for photorealistic post-processing.',
  'https://github.com/bhuvnesh-singh-kushwah/Lipsync-Diffusion-Model',
  ARRAY['Python', 'PyTorch', 'Stable Diffusion', 'GFPGAN', 'Real-ESRGAN'],
  '2025',
  0
),
(
  'Promptfare',
  'Intelligent Flight Search Platform',
  'Built MCP (Model Context Protocol) server enabling AI assistants to query live flight data via 4 custom tools. Developed anti-bot bypass automation using SeleniumBase with cookie rotation and session management.',
  'https://github.com/bhuvnesh-singh-kushwah/Promptfare',
  ARRAY['Python', 'MCP', 'SeleniumBase', 'AI Agents'],
  '2025',
  1
),
(
  'Crypto Wallet Manager',
  'Smart Multi-Crypto Wallet',
  'Built secure local wallet storage with encrypted credentials and transaction utilities.',
  'https://github.com/bhuvnesh-singh-kushwah/Crypto-Wallet-Manager',
  ARRAY['JavaScript', 'Node.js', 'Crypto', 'Security'],
  '2024',
  2
);

-- Skills
INSERT INTO skills (category, items, sort_order) VALUES
(
  'Languages & Backend',
  ARRAY['JavaScript', 'TypeScript', 'Python', 'Go', 'C++', 'Node.js', 'NestJS', 'FastAPI', 'Microservices'],
  0
),
(
  'DevOps',
  ARRAY['CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'NGINX'],
  1
),
(
  'Databases & Cloud',
  ARRAY['MySQL', 'MongoDB', 'Redis', 'ElasticSearch', 'Firebase', 'AWS (EC2/S3/IAM)'],
  2
),
(
  'AI & Automation',
  ARRAY['Selenium', 'Browser Automation', 'PyTorch', 'TensorFlow', 'Whisper', 'TTS/ASR', 'OCR'],
  3
),
(
  'Tools',
  ARRAY['GitHub', 'Bitbucket', 'PM2', 'Celery/BullMQ', 'CDN', 'Ansible', 'Postman'],
  4
);

-- Education
INSERT INTO education (institution, degree, location, grade, year, sort_order) VALUES
(
  'Lakshmi Narain College Of Technology Excellence',
  'Computer Science, Bachelor of Technologies',
  'Bhopal, Madhya Pradesh',
  '8.7 CGPA',
  'Jul 2024',
  0
),
(
  'St. Josheph''s Co-Ed Higher Secondary School',
  'CBSE 12th Board',
  'Bhopal, Madhya Pradesh',
  '81.2%',
  '2020',
  1
);
