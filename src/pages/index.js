import Image from "next/image";
import styles from "../app/page.module.css";
import { Layout } from "@/components/Layout";
import Link from "next/link";

const Home = () => {
  return (
    <div className={styles['container']}>
       <Layout>
      <div className={styles['intro']}>
      <Image
        src="/images/introImage.avif"
        alt="My Image"
        width={500}
        height={400}
      />
      <h1 className={styles['pageTitle']}> Welcome to ListLady</h1>
      <h2 className={styles['slogan']}>What's going to happen tomorrow?</h2>
      </div>
      <div className={styles.container}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className={styles.svg}>
        <path
          fill="#f96060"
          fill-opacity="10000"
          d="M0,64L30,96C60,128,120,192,180,192C240,192,300,128,360,122.7C420,117,480,171,540,202.7C600,235,660,245,720,245.3C780,245,840,235,900,213.3C960,192,1020,160,1080,138.7C1140,117,1200,107,1260,122.7C1320,139,1380,181,1410,202.7L1440,224L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>
            <div className={styles.buttonContainer}>
              <Link href={"/Projects"}>
              <button className={styles.expolreBtn}>Get Started</button>
              </Link>

                <button className={styles.LogIn}>Log In</button>
            </div>
        </div>
        </Layout>
    </div>
   
  );
};

export default Home;
