export default function stringHash (s:string) {
  if(!s) return 0;

  let hash = 0, i, chr;
    for (i = s.length-10; i < s.length; i++) {
      chr = s.charCodeAt(i);
      hash = (
                 (
                     hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
