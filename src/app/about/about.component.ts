import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Experience, Education } from '../models';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  readonly personalInfo = {
    name: 'Nikesh Duwal',
    title: 'Full Stack Developer',
    email: 'nikesh.duwal@example.com',
    location: 'Planet Earth',
    summary: `I am a passionate full-stack developer with over 3 years of experience in building 
              scalable web applications. I specialize in modern JavaScript frameworks, particularly 
              Angular and React, and have extensive experience with Node.js, Python, and cloud technologies. 
              I believe in writing clean, maintainable code and following best practices to deliver 
              high-quality software solutions.`
  };

  readonly skills = {
    frontend: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SASS', 'Bootstrap', 'Material UI'],
    backend: ['Node.js', 'Express.js', 'Python', 'Django', 'REST APIs', 'GraphQL', 'Microservices'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'],
    tools: ['Git', 'Docker', 'AWS', 'Jenkins', 'Webpack', 'VS Code', 'Postman', 'Figma']
  };

  readonly experiences: Experience[] = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      company: 'Test Company',
      period: '2022 - Present',
      description:
        'Led development of enterprise web applications using Angular and Node.js. Implemented microservices architecture and improved application performance by 40%.',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Docker', 'AWS']
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Test Company 2',
      period: '2021 - 2022',
      description:
        'Developed responsive web applications and collaborated with UI/UX designers to create engaging user experiences. Mentored junior developers and established coding standards.',
      technologies: ['React', 'TypeScript', 'SASS', 'Redux', 'Jest']
    },
    {
      id: 3,
      title: 'Junior Developer',
      company: 'Test Company 3',
      period: '2020 - 2021',
      description:
        'Started my journey as a developer, working on various projects and learning modern web development technologies. Contributed to both frontend and backend development.',
      technologies: ['JavaScript', 'HTML/CSS', 'Express.js', 'MySQL']
    }
  ];

  readonly education: Education[] = [
    {
      id: 1,
      degree: 'Bachelor of Computer Science',
      institution: 'Test Education',
      period: '2016 - 2020',
      description: 'Graduated with honors. Focused on software engineering, algorithms, and web development.'
    }
  ];

  readonly interests = [
    'Open Source Contribution',
    'Machine Learning',
    'Cloud Computing',
    'Mobile App Development',
    'Photography',
    'Hiking'
  ];

  trackByExperienceId(index: number, experience: Experience): number {
    return experience.id;
  }

  trackByEducationId(index: number, education: Education): number {
    return education.id;
  }
}
