-- ZTech Grup Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100),
  image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  `order` INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  client VARCHAR(255),
  project_url VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  company VARCHAR(255),
  content TEXT NOT NULL,
  avatar_url VARCHAR(500),
  rating INT DEFAULT 5,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  image_url VARCHAR(500),
  author_id INT,
  category VARCHAR(100),
  tags JSON,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Settings table (key-value for all site content)
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media files table
CREATE TABLE IF NOT EXISTS media_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INT DEFAULT NULL,
  height INT DEFAULT NULL,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, role) VALUES
('admin@ztech.com', '$2a$10$YMiBDNU5xItYfEHnRixEAOW/RgKreVuoJNN/tFIBcAifKiuRoxG6C', 'admin');

-- Insert default settings (all editable frontend text)
INSERT INTO settings (`key`, value) VALUES
('site_title', 'ZTech Grup'),
('site_description', 'Leading technology solutions provider'),
('hero_title', 'Solusi Teknologi Terpercaya'),
('hero_subtitle', 'Kami menyediakan layanan teknologi terbaik untuk bisnis Anda'),
('hero_badge', 'Trusted by Industry Leaders'),
('hero_features', '["Professional Development Team","Modern Technology Stack","Agile Development Process","100% Client Satisfaction"]'),
('stats_title', 'Trusted by Industry Leaders'),
('stats_subtitle', 'Our track record speaks for itself.'),
('stats_items', '[{"number":"50","suffix":"+","label":"Happy Clients","description":"Trusted by businesses worldwide"},{"number":"150","suffix":"+","label":"Projects Completed","description":"Successfully delivered solutions"},{"number":"5","suffix":"+","label":"Years Experience","description":"In technology development"},{"number":"99","suffix":"%","label":"Client Satisfaction","description":"Based on client feedback"}]'),
('cta_badge', 'Ready to Get Started?'),
('cta_title', 'Transform Your Business with Cutting-Edge Technology'),
('cta_subtitle', 'Join 50+ successful companies who have trusted us to deliver exceptional digital solutions.'),
('about_title', 'Transforming Business Through Innovation'),
('about_subtitle', 'With 5+ years of expertise in technology solutions, we have helped 50+ companies achieve their digital transformation goals.'),
('about_why_title', 'Why Choose ZTech Grup?'),
('about_why_text', 'We are not just a technology company; we are your strategic partner in digital transformation.'),
('about_features', '["Professional Development Team","Agile Development Methodology","24/7 Technical Support","Scalable Solutions","Modern Technology Stack","Quality Assurance Testing"]'),
('footer_text', 'Leading technology solutions provider, transforming businesses through innovative digital solutions.'),
('footer_copyright', '© {year} ZTech Grup. All rights reserved.'),
('contact_email', 'info@ztech.com'),
('contact_phone', '+62 xxx xxxx xxxx'),
('contact_address', 'Jakarta, Indonesia'),
('contact_working_hours', 'Mon - Fri: 9:00 AM - 6:00 PM'),
('social_github', '#'),
('social_twitter', '#'),
('social_linkedin', '#'),
('social_instagram', '#'),
('navbar_cta_text', 'Get Quote'),
('logo_url', '');
