
import { Batch, Sheet } from './types';

export const BATCHES: Batch[] = [
  {
    id: '1',
    name: 'HSC ICT Marathon (Normal)',
    category: 'HSC',
    timeSlots: [
      'Saturday (Any time)',
      'Tuesday (8:30 PM - 9:30 PM)',
      'Thursday (8:30 PM - 9:30 PM)'
    ],
    fee: '10,000 BDT / 12 Lectures'
  },
  {
    id: '2',
    name: 'Before HSC (Intensive)',
    category: 'Intensive',
    timeSlots: [
      'Friday & Saturday',
      'Any time (1.5 hours per day)'
    ],
    fee: '10,000 BDT / 8 Lectures'
  },
  {
    id: '3',
    name: 'Relax Techy',
    category: 'HSC',
    timeSlots: [
      'Friday & Saturday',
      'Any time (1.5 hours each lecture)'
    ],
    fee: '10,000 BDT / 8 Lectures'
  },
  {
    id: '4',
    name: 'Online Batch',
    category: 'Online',
    timeSlots: [
      'Any 3 days at 10:00 PM'
    ],
    fee: '10,000 BDT / 12 Lectures (Prepaid)'
  }
];

const getDriveDownloadLink = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`;

export const SHEETS: Sheet[] = [
  { 
    id: 's1', 
    chapter: '1', 
    title: 'ICT: World & Bangladesh', 
    description: 'Chapter 1: Virtual Reality, Biometrics, Robotics and Ethics.', 
    icon: 'Globe',
    downloadUrl: getDriveDownloadLink('1cHMAuoZL18jFiH8yVKamwcK3kYqEChCE')
  },
  { 
    id: 's2', 
    chapter: '2', 
    title: 'Communication Systems', 
    description: 'Chapter 2: Data transmission, Networking, and Wireless media.', 
    icon: 'Wifi',
    downloadUrl: 'https://drive.google.com/drive/folders/1Swj8x7abb3ElP0g8mexKSjgCOuL0PMLE?usp=sharing'
  },
  { 
    id: 's3', 
    chapter: '3.1', 
    title: 'Number System', 
    description: 'Chapter 3.1: Binary, Octal, Hexadecimal and 2s Complement.', 
    icon: 'Hash',
    downloadUrl: getDriveDownloadLink('1heN-tmzv9V8RzDFnqmJ0zdeCqQV5hkfI')
  },
  { 
    id: 's32', 
    chapter: '3.2', 
    title: 'Digital Devices', 
    description: 'Chapter 3.2: Logic Gates, Encoder, Decoder, and Flip-flops.', 
    icon: 'Cpu',
    downloadUrl: 'https://drive.google.com/drive/folders/1M-xu3eqmRu4O1lRdi3dmSSgneN7tHGal?usp=drive_link'
  },
  { 
    id: 's4', 
    chapter: '4', 
    title: 'Web Design & HTML', 
    description: 'Chapter 4: HTML Tags, Lists, Tables and Hyperlinks.', 
    icon: 'Code',
    downloadUrl: getDriveDownloadLink('17Y6qE2qP8TbDAe4x8dCs6tTqXa3ofbXd')
  },
  { 
    id: 's5', 
    chapter: '5', 
    title: 'C Programming', 
    description: 'Chapter 5: Variables, Loops, Arrays and Logic Building.', 
    icon: 'Terminal',
    downloadUrl: getDriveDownloadLink('1QAticROFCoN0cfo4CP6tRoS37X7N7EV9')
  },
  { 
    id: 's6', 
    chapter: '6', 
    title: 'Database (DBMS)', 
    description: 'Chapter 6: SQL, Relations, Keys and Data normalization.', 
    icon: 'Database',
    downloadUrl: 'https://drive.google.com/drive/folders/16Im9T8_TMi4p8s1xuWYbB0MfYUf9JwM6?usp=drive_link'
  }
];

export const EBOOKS = [
  {
    id: 'eb1',
    title: 'ICT BOOK || Akkhorpotro',
    url: 'https://drive.google.com/file/d/1ImoFqcI6F5txARlYNJOMPgrphUQTG1Tw/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1ImoFqcI6F5txARlYNJOMPgrphUQTG1Tw',
    coverImage: 'https://drive.google.com/thumbnail?id=1uzvrHjE-VQFqIRkr-3h9kdQ1vNQwKHIU&sz=w1000',
    description: 'The standard textbook for HSC preparation. Full access allowed.'
  },
  {
    id: 'eb2',
    title: 'ICT BOOK || MOJIBOR RAHMAN',
    url: 'https://drive.google.com/file/d/1PAMhyizhGvsoyGNj5g55Ngo6SlK6Stpw/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PAMhyizhGvsoyGNj5g55Ngo6SlK6Stpw',
    coverImage: 'https://drive.google.com/thumbnail?id=1ZjIFIUY_iejyshnaHE-hTPL9re3HEc5C&sz=w1000',
    description: 'Highly recommended for complex logic and programming shortcuts.'
  },
  {
    id: 'eb3',
    title: 'HSC ICT by Cambrian',
    url: 'https://drive.google.com/file/d/1tLUqhXVWspKFB8tSJ0wAF7VYBZFRt3UP/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1tLUqhXVWspKFB8tSJ0wAF7VYBZFRt3UP',
    coverImage: 'https://drive.google.com/thumbnail?id=1gVSABS_NiFEyn-LJwq9Huee6IJjhwq-C&sz=w1000',
    description: 'Cambrian Publication ICT book. Comprehensive question bank for HSC.'
  }
];

export const PRACTICE_QUESTIONS = [
  {
    chapter: "Chapter 1",
    questions: [
      "What is Biometrics? Explain its uses in security.",
      "How does Virtual Reality impact modern education?",
      "Explain Cryosurgery and its technological aspects."
    ]
  },
  {
    chapter: "Chapter 3.1",
    questions: [
      "Convert (101.11) base 2 to Decimal.",
      "Explain the significance of 2's complement in computer subtraction.",
      "Add (AF)16 and (75)8. Show the result in Binary."
    ]
  },
  {
    chapter: "Chapter 3.2",
    questions: [
      "Explain the working of a Full Adder with truth table and circuit.",
      "Draw the logic circuit for the Boolean expression: F = (A+B).(A'+C).",
      "What is a Flip-Flop? Describe the working of a JK Flip-Flop."
    ]
  },
  {
    chapter: "Chapter 4: HTML",
    questions: [
      "Create an HTML table with 3 rows and 3 columns. Use 'rowspan' and 'colspan'.",
      "Write code for an Unordered List of 5 colors where each list item is a link.",
      "Explain the difference between <img> tag attributes 'src' and 'alt'."
    ]
  },
  {
    chapter: "Chapter 5: C Programming",
    questions: [
      "Write a C program to print the Fibonacci series up to N terms.",
      "Explain 'Nested If-Else' with a program to find the largest of three numbers.",
      "Write a C program using a 'while' loop to calculate the sum of digits of a number."
    ]
  },
  {
    chapter: "Chapter 6: SQL",
    questions: [
      "Write a query to SELECT students whose 'GPA' is above 4.5 and ORDER by 'Name'.",
      "Explain the 'JOIN' operation with a simple table example.",
      "What is Normalization? Explain 2NF with a suitable table structure."
    ]
  }
];
