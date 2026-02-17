import { StaffTask, User, Organization, Brand } from './types';

export const ORGS: Organization[] = [
  { 
    id: 'org-cloudcrave', 
    name: 'CloudCrave Solutions', 
    slug: 'cloudcrave', 
    createdAt: '2024-11-20T00:00:00Z',
    tenantId: 'tenant-cc-001'
  }
];

export const BRANDS: Brand[] = [
  { 
    id: 'b-cloudcrave', 
    orgId: 'org-cloudcrave', 
    name: 'CloudCrave', 
    services: ['Social Media Management', 'General Operations'],
    leadId: 'u-ademuyiwa'
  },
  { 
    id: 'b-homeetal', 
    orgId: 'org-cloudcrave', 
    name: 'HomeEtal x Microdia', 
    services: ['Social Media Management', 'Digital Solutions'],
    leadId: 'u-ademuyiwa'
  },
  { 
    id: 'b-switch2tech', 
    orgId: 'org-cloudcrave', 
    name: 'Switch2Tech', 
    services: ['Switch2Tech Training', 'Digital Solutions'],
    leadId: 'u-ademuyiwa'
  },
  { 
    id: 'b-kingzy', 
    orgId: 'org-cloudcrave', 
    name: 'Kingzy', 
    services: ['Digital Solutions'],
    leadId: 'u-sheriff'
  },
  { 
    id: 'b-heritage', 
    orgId: 'org-cloudcrave', 
    name: 'Heritage Plate', 
    services: ['Digital Solutions'],
    leadId: 'u-sheriff'
  },
  { 
    id: 'b-sheedah', 
    orgId: 'org-cloudcrave', 
    name: 'Sheedah Fabrics', 
    services: ['Social Media Management'],
    leadId: 'u-adeola'
  },
  { 
    id: 'b-social-shield', 
    orgId: 'org-cloudcrave', 
    name: 'Social Shield', 
    services: ['Social Media Management'],
    leadId: 'u-adeola'
  },
  { 
    id: 'b-healthy-mind', 
    orgId: 'org-cloudcrave', 
    name: 'Healthy Mind', 
    services: ['Social Media Management', 'Digital Solutions'],
    leadId: 'u-healthymind-member'
  }
];

export const USERS: User[] = [
  { 
    id: 'u-root', 
    orgId: 'org-cloudcrave', 
    name: 'Platform Support', 
    email: 'support@cloudcraves.com', 
    role: 'Admin', 
    registrationStatus: 'approved' 
  },
  { 
    id: 'u-ademuyiwa', 
    orgId: 'org-cloudcrave', 
    name: 'Ademuyiwa', 
    email: 'ademuyiwa.ogunnowo@cloudcraves.com', 
    role: 'Staff Lead', 
    registrationStatus: 'approved' 
  },
  { 
    id: 'u-adeola', 
    orgId: 'org-cloudcrave', 
    name: 'Adeola Lois', 
    email: 'adeola.lois@cloudcraves.com', 
    role: 'Staff Lead', 
    registrationStatus: 'approved' 
  },
  { 
    id: 'u-sheriff', 
    orgId: 'org-cloudcrave', 
    name: 'Sheriff Saka', 
    email: 'sheriff.saka@cloudcraves.com', 
    role: 'Staff Lead', 
    registrationStatus: 'approved' 
  },
  { 
    id: 'u-blessing', 
    orgId: 'org-cloudcrave', 
    name: 'Blessing Bassey', 
    email: 'blessing.bassey@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-faramade', 
    orgId: 'org-cloudcrave', 
    name: 'Esther Afolayan', 
    email: 'afolayan.esther@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-adesewa', 
    orgId: 'org-cloudcrave', 
    name: 'Adesewa Alago', 
    email: 'alago.adeshewa@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-kingzy', 
    orgId: 'org-cloudcrave', 
    name: 'Kingzy', 
    email: 'kingzy@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-healthymind-member', 
    orgId: 'org-cloudcrave', 
    name: 'Healthy Mind Member', 
    email: 'healthymind@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-aj', 
    orgId: 'org-cloudcrave', 
    name: 'AJ', 
    email: 'aj@gmail.com', 
    role: 'Mentee', 
    registrationStatus: 'approved' 
  }
];

export const MOCK_TASKS: StaffTask[] = [
  {
    id: 't-cc-adem-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-cloudcrave',
    serviceType: 'Social Media Management',
    staffName: 'Ademuyiwa',
    assignedBy: 'Platform Support',
    taskTitle: 'CloudCrave Brand Awareness',
    taskDescription: 'Execute primary social media strategy for CloudCrave ecosystem. Focus on LinkedIn and professional networking posts.',
    category: 'Content Optimisation',
    type: 'Recurring',
    frequency: 'Daily',
    status: 'In Progress',
    dueDate: '2024-12-30',
    progressUpdate: 'Consistent daily updates logged.',
    estimatedHours: 10,
    hoursSpent: 4,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-cc-aj-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-cloudcrave',
    serviceType: 'Social Media Management',
    staffName: 'AJ',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'CloudCrave Engagement Coordination',
    taskDescription: 'Coordinating response strategy and engagement for CloudCrave social channels.',
    category: 'Engagement Optimisation',
    type: 'Recurring',
    frequency: 'Daily',
    status: 'In Progress',
    dueDate: '2024-12-30',
    progressUpdate: '',
    estimatedHours: 8,
    hoursSpent: 2,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-hm-adem-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-homeetal',
    serviceType: 'Social Media Management',
    staffName: 'Ademuyiwa',
    assignedBy: 'Platform Support',
    taskTitle: 'HomeEtal x Microdia SMM Execution',
    taskDescription: 'Full social media lifecycle management for the HomeEtal collaboration.',
    category: 'Content Optimisation',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-12-15',
    progressUpdate: 'Campaign assets approved.',
    estimatedHours: 12,
    hoursSpent: 3,
    comments: [],
    reportingPeriod: 'Nov 2024'
  }
];