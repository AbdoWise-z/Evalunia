import {NextResponse} from "next/server";
import {addProfessorToDB} from "@/lib/db-helper";


const mock_data = [
  {
    "name": "Dr. Emily Johnson",
    "email": "emily.johnson@university.edu",
    "imageUrl": "https://example.com/images/emily-johnson.jpg",
    "address": "123 Academic Ave, College Town, CT 12345",
    "phone": "+1 (555) 123-4567",
    "tags": ["Computer Science", "Artificial Intelligence", "Machine Learning"],
    "school": "School of Computer Science",
    "birthDate": new Date("1975-08-15T00:00:00Z"),
    "qualifications": "Ph.D. in Computer Science, Stanford University",
    "summary": "Dr. Johnson is a trailblazer in AI ethics and a passionate advocate for women in STEM. Her groundbreaking work on bias in machine learning algorithms has led to significant improvements in AI fairness. Outside the lab, she mentors young scientists and runs a successful tech podcast. An avid rock climber, she often draws parallels between problem-solving in her sport and in her research."
  },
  {
    "name": "Prof. Michael Chen",
    "email": "m.chen@university.edu",
    "imageUrl": "https://example.com/images/michael-chen.jpg",
    "address": "456 Research Blvd, Innovation City, IC 67890",
    "phone": "+1 (555) 987-6543",
    "tags": ["Physics", "Quantum Mechanics", "Astrophysics"],
    "school": "Department of Physics",
    "birthDate": new Date("1980-03-22T00:00:00Z"),
    "qualifications": "Ph.D. in Theoretical Physics, MIT",
    "summary": "Prof. Chen is renowned for his ability to bridge the gap between theoretical physics and public understanding. His work on quantum entanglement has pushed the boundaries of our understanding of the universe. A lifelong science fiction fan, he often incorporates elements from the genre into his lectures, making complex concepts accessible and engaging. He's also known for his annual 'Physics in Pop Culture' seminar, which always has a waitlist."
  },
  {
    "name": "Dr. Sarah Martinez",
    "email": "s.martinez@university.edu",
    "imageUrl": "https://example.com/images/sarah-martinez.jpg",
    "address": "789 Biology Lane, Science Park, SP 54321",
    "phone": "+1 (555) 246-8135",
    "tags": ["Biology", "Genetics", "Molecular Biology"],
    "school": "School of Life Sciences",
    "birthDate": new Date("1982-11-30T00:00:00Z"),
    "qualifications": "Ph.D. in Molecular Biology, Harvard University",
    "summary": "Dr. Martinez is at the forefront of CRISPR gene editing research, with her work potentially revolutionizing the treatment of genetic disorders. Known for her collaborative approach, she frequently brings together experts from diverse fields to tackle complex biological questions. Outside the lab, she's an accomplished violinist and often performs at charity events to raise funds for rare disease research."
  },
  {
    "name": "Prof. David Kim",
    "email": "d.kim@university.edu",
    "imageUrl": "https://example.com/images/david-kim.jpg",
    "address": "101 Engineering Circle, Tech City, TC 13579",
    "phone": "+1 (555) 369-2580",
    "tags": ["Electrical Engineering", "Robotics", "Control Systems"],
    "school": "School of Engineering",
    "birthDate": new Date("1978-06-10T00:00:00Z"),
    "qualifications": "Ph.D. in Electrical Engineering, Caltech",
    "summary": "Prof. Kim's innovative work in soft robotics has led to breakthroughs in prosthetic limb development. He's a strong believer in practical education, often involving students in real-world engineering projects with local tech companies. A dedicated marathon runner, he applies the principles of endurance and perseverance from his sport to his research, inspiring his students to push through challenges in their work."
  },
  {
    "name": "Dr. Laura Thompson",
    "email": "l.thompson@university.edu",
    "imageUrl": "https://example.com/images/laura-thompson.jpg",
    "address": "202 Psychology Building, Mind Valley, MV 24680",
    "phone": "+1 (555) 147-2589",
    "tags": ["Psychology", "Cognitive Science", "Neuroscience"],
    "school": "Department of Psychology",
    "birthDate": new Date("1985-09-18T00:00:00Z"),
    "qualifications": "Ph.D. in Cognitive Psychology, Yale University",
    "summary": "Dr. Thompson's research on memory reconsolidation has gained international recognition, potentially revolutionizing treatments for PTSD and phobias. Her engaging lectures often incorporate interactive demonstrations, making complex psychological concepts accessible to students from various disciplines. A published poet, she explores the intersection of neuroscience and creativity in her literary works, bridging the gap between science and art."
  },
  {
    "name": "Prof. Robert Nguyen",
    "email": "r.nguyen@university.edu",
    "imageUrl": "https://example.com/images/robert-nguyen.jpg",
    "address": "303 Chemistry Lab, Molecule City, MC 97531",
    "phone": "+1 (555) 753-9514",
    "tags": ["Chemistry", "Organic Chemistry", "Biochemistry"],
    "school": "Department of Chemistry",
    "birthDate": new Date("1973-12-05T00:00:00Z"),
    "qualifications": "Ph.D. in Organic Chemistry, UC Berkeley",
    "summary": "Prof. Nguyen is renowned for his work in developing new pharmaceutical compounds, with several of his discoveries now in clinical trials. A strong advocate for science education, he frequently gives public lectures and has developed a popular online course on the chemistry of everyday life. An amateur chef, he combines his love for cooking and chemistry in a unique 'molecular gastronomy' workshop for students, making complex chemical principles tangible and delicious."
  },
  {
    "name": "Dr. Amanda Lee",
    "email": "a.lee@university.edu",
    "imageUrl": "https://example.com/images/amanda-lee.jpg",
    "address": "404 Math Hall, Number Town, NT 86420",
    "phone": "+1 (555) 951-7532",
    "tags": ["Mathematics", "Number Theory", "Cryptography"],
    "school": "Department of Mathematics",
    "birthDate": new Date("1988-02-29T00:00:00Z"),
    "qualifications": "Ph.D. in Mathematics, Princeton University",
    "summary": "Dr. Lee is a rising star in the field of cryptography, with her work on post-quantum cryptography attracting attention from both academia and industry. She's known for her ability to bridge pure mathematics and practical applications, often collaborating with computer scientists on real-world security problems. A competitive chess player, she draws parallels between chess strategy and mathematical problem-solving in her popular undergraduate seminar."
  },
  {
    "name": "Prof. James Wilson",
    "email": "j.wilson@university.edu",
    "imageUrl": "https://example.com/images/james-wilson.jpg",
    "address": "505 History Building, Past City, PC 13579",
    "phone": "+1 (555) 159-7532",
    "tags": ["History", "Ancient Civilizations", "Archaeology"],
    "school": "Department of History",
    "birthDate": new Date("1970-07-14T00:00:00Z"),
    "qualifications": "Ph.D. in Ancient History, Oxford University",
    "summary": "Prof. Wilson is a charismatic lecturer who brings ancient history to life through immersive virtual reality reconstructions of historical sites. He's led several high-profile archaeological expeditions, including one that uncovered a previously unknown ancient city. Passionate about preserving historical sites, he actively lobbies for stricter laws against artifact trafficking. An avid collector of antique maps, he often incorporates them into his lectures to illustrate changing perceptions of the world throughout history."
  },
  {
    "name": "Dr. Elena Rodriguez",
    "email": "e.rodriguez@university.edu",
    "imageUrl": "https://example.com/images/elena-rodriguez.jpg",
    "address": "606 Language Center, Word Town, WT 24680",
    "phone": "+1 (555) 357-1590",
    "tags": ["Linguistics", "Sociolinguistics", "Language Acquisition"],
    "school": "Department of Linguistics",
    "birthDate": new Date("1983-04-25T00:00:00Z"),
    "qualifications": "Ph.D. in Linguistics, UCLA",
    "summary": "Dr. Rodriguez's work on language evolution and bilingualism has reshaped our understanding of how humans acquire and process language. Fluent in five languages, she's dedicated to promoting linguistic diversity and has developed innovative language learning apps. Her research on the cognitive benefits of multilingualism has influenced educational policies worldwide. A talented salsa dancer, she often uses dance metaphors to explain complex linguistic concepts, making her classes both informative and entertaining."
  },
  {
    "name": "Prof. Thomas Brown",
    "email": "t.brown@university.edu",
    "imageUrl": "https://example.com/images/thomas-brown.jpg",
    "address": "707 Economics Building, Market Square, MS 97531",
    "phone": "+1 (555) 852-9630",
    "tags": ["Economics", "Microeconomics", "Game Theory"],
    "school": "School of Economics",
    "birthDate": new Date("1976-01-08T00:00:00Z"),
    "qualifications": "Ph.D. in Economics, University of Chicago",
    "summary": "Prof. Brown is a leading expert in game theory, with several influential publications that have reshaped economic thinking. Known for his rigorous approach to economic analysis, he frequently consults for tech companies on auction design and pricing strategies. His dry sense of humor and real-world examples make his game theory course one of the most popular on campus. An enthusiastic bird watcher, he often uses examples from avian behavior to illustrate game theory principles, bridging the gap between economics and biology."
  },
  {
    "name": "Dr. Olivia Green",
    "email": "o.green@university.edu",
    "imageUrl": "https://example.com/images/olivia-green.jpg",
    "address": "808 Environmental Science Center, Eco City, EC 35791",
    "phone": "+1 (555) 741-8520",
    "tags": ["Environmental Science", "Climate Change", "Sustainability"],
    "school": "School of Environmental Studies",
    "birthDate": new Date("1984-10-20T00:00:00Z"),
    "qualifications": "Ph.D. in Environmental Science, Columbia University",
    "summary": "Dr. Green is a vocal advocate for environmental protection and sustainable living, with her research on urban sustainability influencing city planning worldwide. She leads by example, living in a self-designed eco-friendly house and driving an electric car. Her innovative 'City of the Future' project, which allows students to design and simulate sustainable urban environments, has been adopted by several universities. A skilled nature photographer, she uses her images in lectures to highlight the beauty of ecosystems and the urgency of conservation efforts."
  },
  {
    "name": "Prof. Daniel Taylor",
    "email": "d.taylor@university.edu",
    "imageUrl": "https://example.com/images/daniel-taylor.jpg",
    "address": "909 Art Building, Creative Lane, CL 86420",
    "phone": "+1 (555) 369-7410",
    "tags": ["Art History", "Renaissance Art", "Museum Studies"],
    "school": "Department of Art History",
    "birthDate": new Date("1972-05-17T00:00:00Z"),
    "qualifications": "Ph.D. in Art History, New York University",
    "summary": "Prof. Taylor is renowned for his extensive knowledge of Renaissance art and his innovative approach to art education. He's curated several major exhibitions, including a groundbreaking show that used augmented reality to bring Renaissance paintings to life. Passionate about making art accessible to the public, he developed a popular app that offers virtual museum tours. An amateur painter himself, he encourages students to understand art from both a theoretical and practical perspective, often incorporating hands-on workshops into his courses."
  },
  {
    "name": "Dr. Sophia Patel",
    "email": "s.patel@university.edu",
    "imageUrl": "https://example.com/images/sophia-patel.jpg",
    "address": "1010 Medical Center, Health City, HC 13579",
    "phone": "+1 (555) 258-1470",
    "tags": ["Medicine", "Immunology", "Virology"],
    "school": "School of Medicine",
    "birthDate": new Date("1979-08-03T00:00:00Z"),
    "qualifications": "M.D. and Ph.D. in Immunology, Johns Hopkins University",
    "summary": "Dr. Patel is at the forefront of vaccine research, with her work on universal flu vaccines showing promising results in clinical trials. She's known for her dedication to global health issues, frequently volunteering in developing countries to combat infectious diseases. Her innovative approach to medical education, which includes virtual reality simulations of immune system responses, has revolutionized how immunology is taught. A certified yoga instructor, she emphasizes the importance of holistic health and stress management to her medical students."
  },
  {
    "name": "Prof. Christopher Lee",
    "email": "c.lee@university.edu",
    "imageUrl": "https://example.com/images/christopher-lee.jpg",
    "address": "1111 Business School, Commerce Park, CP 24680",
    "phone": "+1 (555) 963-8520",
    "tags": ["Business", "Finance", "Corporate Strategy"],
    "school": "School of Business",
    "birthDate": new Date("1977-03-12T00:00:00Z"),
    "qualifications": "Ph.D. in Business Administration, Wharton School",
    "summary": "Prof. Lee brings a wealth of real-world experience to his teaching, having served as CEO of a Fortune 500 company before entering academia. His research on adaptive corporate strategies in times of crisis has been widely influential in the business world. Known for his 'Leadership Lab' course, where students run simulated companies, he provides hands-on experience in executive decision-making. A dedicated mentor to aspiring entrepreneurs, he has helped launch several successful student-led startups. In his spare time, he competes in ironman triathlons, embodying the discipline and endurance he teaches in his business courses."
  },
  {
    "name": "Dr. Rachel Cohen",
    "email": "r.cohen@university.edu",
    "imageUrl": "https://example.com/images/rachel-cohen.jpg",
    "address": "1212 Social Science Building, Society Square, SS 97531",
    "phone": "+1 (555) 741-9630",
    "tags": ["Sociology", "Urban Studies", "Social Inequality"],
    "school": "Department of Sociology",
    "birthDate": new Date("1986-12-28T00:00:00Z"),
    "qualifications": "Ph.D. in Sociology, University of Michigan",
    "summary": "Dr. Cohen's groundbreaking research on urban inequality has significantly influenced public policy, leading to the implementation of several social programs in major cities. She's known for her community engagement and participatory research methods, often involving local residents in her studies to ensure their voices are heard. Her innovative 'City Walk' course, where students explore different neighborhoods and interact with community leaders, has become a model for experiential learning in sociology. An accomplished jazz pianist, she frequently performs at local venues, using music as a means to bridge social divides and build community connections."
  }
];

export async function GET(req: Request) {
  try {
    if (true) {
      return NextResponse.json({
        "id" : "Disabled",
      });
    }

    let id: string[] = [];
    for (const prof of mock_data){
      console.log("start: " + prof.name);
      id.push(await addProfessorToDB(prof));
    }

    return NextResponse.json({
      "id" : id,
    });
  } catch (error){
    console.log("GET [api/test]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}