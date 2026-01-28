import React from 'react';
import tamagotchiHeart from '../assets/icons/heart.svg';

// Responsive hook for media queries
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

interface FooterProps {
  isTamagotchiMode?: boolean;
}

const styles = {
  appFooter: (isMobile: boolean, isTamagotchi: boolean): React.CSSProperties => ({
    width: '100%',
    display: isMobile ? 'column' : 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'center' : 'flex-end',
    padding: isMobile ? '1rem 1vw 70px 1vw' : '0 2vw 0px 2vw',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.015) 0%, #000000 30%, #000 100%)',
    pointerEvents: 'none',
    position: 'relative',
  }),
  section: (align: 'left' | 'center' | 'right', isMobile: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMobile ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
    textAlign: isMobile ? 'center' : align === 'left' ? 'left' : 'right',
    pointerEvents: 'auto',
  }),
  title: (isMobile: boolean): React.CSSProperties => ({
    fontFamily: 'Inter, SF Pro, Helvetica Neue, Arial, sans-serif',
    fontWeight: 400,
    fontSize: isMobile ? '64px' : '90px',
    letterSpacing: '-0.04em',
    opacity: 0.5,
    background: 'linear-gradient(90deg, #686868aa, #1a1a1a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: 'none',
    marginBottom: '0.2rem',
  }),
  tagline: (isMobile: boolean): React.CSSProperties => ({
    fontFamily: 'Inter, SF Pro, Helvetica Neue, Arial, sans-serif',
    fontWeight: 400,
    fontSize: isMobile ? '32px' : '66px',
    letterSpacing: '-0.04em',
    opacity: 0.5,
    background: 'linear-gradient(90deg, #5a5a5ab7, #ffffffb7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: 'none',
    marginBlock: isMobile ? '40px' : '120px',
    marginBottom: '0.1em',
    maxWidth: isMobile ? '95%' : '70%',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    lineHeight: 1.1,
    textAlign: 'left',
    marginLeft: 'auto',
    paddingRight: isMobile ? '2%' : '5%',
    marginRight: isMobile ? '2%' : '2%',
  }),
  copyright: (isMobile: boolean): React.CSSProperties => ({
    fontFamily: 'Inter, SF Pro, Helvetica Neue, Arial, sans-serif',
    fontWeight: 500,
    fontSize: isMobile ? '16px' : '20px',
    letterSpacing: '-0.03em',
    opacity: 0.5,
    background: 'linear-gradient(0deg, #d0d0d0, #2a2a2a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginTop: '-0.75rem',
    marginBottom: isMobile ? '30px' : '70px',
  }),
  center: (isMobile: boolean): React.CSSProperties => ({
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    pointerEvents: 'auto',
    marginTop: isMobile ? '1rem' : '6rem',
    marginBottom: isMobile ? '1rem' : '6rem',
    marginLeft: isMobile ? '0' : '6em',
    textAlign: 'center',
  }),
  iconsWrapper: (isMobile: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
    marginBottom: '-25px',
  }),
  madeBy: (isTamagotchi: boolean): React.CSSProperties => ({
    fontFamily: isTamagotchi ? 'Minecraftia, monospace' : 'Inter, SF Pro, Helvetica Neue, Arial, sans-serif',
    fontWeight: isTamagotchi ? 400 : 450,
    fontSize: isTamagotchi ? '24px' : '20px',
    color: '#e3e2e2',
    textShadow: '0 0 4px rgba(255,255,255,0.3)',
    letterSpacing: isTamagotchi ? '0.02rem' : '0',
    filter: 'drop-shadow(0 0 2px #fff3)',
    WebkitFontSmoothing: isTamagotchi ? 'none' : undefined,
    MozOsxFontSmoothing: isTamagotchi ? 'grayscale' : undefined,
    imageRendering: isTamagotchi ? 'pixelated' : undefined,
    textRendering: isTamagotchi ? 'optimizeSpeed' : undefined,
  }),
  heart: {
    display: 'inline-block',
    verticalAlign: 'middle',
    margin: '0 4px',
    filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    width: '35px',
    height: '35px',
    transition: 'transform 0.18s cubic-bezier(.4,1.3,.6,1), filter 0.18s',
    filter: 'drop-shadow(0 1px 3px rgba(255,255,255,0.25))',
    borderRadius: '50%',
    textDecoration: 'none',
    outline: 'none',
  },
};

const Footer: React.FC<FooterProps> = ({ isTamagotchiMode = false }) => {
  const isMobile = useMediaQuery('(max-width: 700px)');

  return (
    <footer style={styles.appFooter(isMobile, isTamagotchiMode)}>
      <div style={styles.section('left', isMobile)}>
        <div style={styles.title(isMobile)}>Flow Timer.</div>
        <div style={styles.copyright(isMobile)}>©2025</div>
      </div>
      <div style={styles.center(isMobile)}>
        <div style={styles.iconsWrapper(isMobile)}>
          <div style={styles.madeBy(isTamagotchiMode)}>
            Made with{' '}
            {isTamagotchiMode ? (
              <img
                src={tamagotchiHeart}
                alt="heart"
                width={30}
                height={30}
                style={{ ...styles.heart, marginBottom: '50px' }}
              />
            ) : (
              <span role="img" aria-label="heart"> ❤️ </span>
            )}
            {' '}by Manasvi
          </div>
          <div style={styles.icons}>
            <a href="https://github.com/manasvitwr" style={styles.iconLink} aria-label="GitHub">
              {/* GitHub SVG */}
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h24v24h-24z" fill="none" /><path d="m16.24 22a1 1 0 0 1 -1-1v-2.6a2.15 2.15 0 0 0 -.54-1.66 1 1 0 0 1 .61-1.67c2.44-.29 4.69-1.07 4.69-5.3a4 4 0 0 0 -.67-2.22 2.75 2.75 0 0 1 -.41-2.06 3.71 3.71 0 0 0 0-1.41 7.65 7.65 0 0 0 -2.09 1.09 1 1 0 0 1 -.84.15 10.15 10.15 0 0 0 -5.52 0 1 1 0 0 1 -.84-.15 7.4 7.4 0 0 0 -2.11-1.09 3.52 3.52 0 0 0 0 1.41 2.84 2.84 0 0 1 -.43 2.08 4.07 4.07 0 0 0 -.67 2.23c0 3.89 1.88 4.93 4.7 5.29a1 1 0 0 1 .82.66 1 1 0 0 1 -.21 1 2.06 2.06 0 0 0 -.55 1.56v2.69a1 1 0 0 1 -2 0v-.57a6 6 0 0 1 -5.27-2.09 3.9 3.9 0 0 0 -1.16-.88 1 1 0 1 1 .5-1.94 4.93 4.93 0 0 1 2 1.36c1 1 2 1.88 3.9 1.52a3.89 3.89 0 0 1 .23-1.58c-2.06-.52-5-2-5-7a6 6 0 0 1 1-3.33.85.85 0 0 0 .13-.62 5.69 5.69 0 0 1 .33-3.21 1 1 0 0 1 .63-.57c.34-.1 1.56-.3 3.87 1.2a12.16 12.16 0 0 1 5.69 0c2.31-1.5 3.53-1.31 3.86-1.2a1 1 0 0 1 .63.57 5.71 5.71 0 0 1 .33 3.22.75.75 0 0 0 .11.57 6 6 0 0 1 1 3.34c0 5.07-2.92 6.54-5 7a4.28 4.28 0 0 1 .22 1.67v2.54a1 1 0 0 1 -.94 1z" fill="#fff"/></svg>
            </a>
            <a href="https://x.com/manasvitwr" style={styles.iconLink} aria-label="Twitter">
              {/* Twitter SVG */}
              <svg width="35" height="35" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 001.963-2.475 8.94 8.94 0 01-2.828 1.082A4.48 4.48 0 0016.11 4c-2.485 0-4.5 2.015-4.5 4.5 0 .353.04.697.116 1.027C7.728 9.37 4.1 7.575 1.67 4.905c-.387.664-.61 1.437-.61 2.26 0 1.56.794 2.936 2.003 3.744-.737-.023-1.43-.226-2.037-.563v.057c0 2.18 1.55 4.002 3.604 4.418-.377.103-.775.158-1.186.158-.29 0-.57-.028-.844-.08.57 1.78 2.223 3.075 4.183 3.11A9.01 9.01 0 012 19.54a12.73 12.73 0 006.92 2.03c8.303 0 12.85-6.876 12.85-12.844 0-.196-.004-.392-.013-.586A9.22 9.22 0 0024 4.59a8.98 8.01 0 01-2.54.698z"/></svg>
            </a>
            <a href="mailto:manasvi.tiwari@proton.me" style={styles.iconLink} aria-label="Email">
              {/* Email SVG */}
<svg width="35" height="35" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div>
        <div style={styles.tagline(isMobile)}>
          built for timeblocking.
        </div>
        <div style={styles.copyright(isMobile)}></div>
      </div>
    </footer>
  );
};

export default Footer;
              