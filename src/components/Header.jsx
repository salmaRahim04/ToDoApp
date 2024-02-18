import Image from "next/image";
import styles from "../app/page.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <div className={styles['header']}>
   <Link href={'/'}>
   <Image
      src="/images/Icon-LOGO.png"
      alt="My Image"
      width={100}
      height={100}
    />
   </Link>
     <ul className={styles.list}>
          <li>About</li>
          <li>Sign In</li>
      </ul>
    </div>
  )
}

export default Header