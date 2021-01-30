let m_w = 123456789;
let m_z = 987654321;
let mask = 0xffffffff;

// Takes any integer
function setSeed(i:number) {
  m_w = (
            123456789 + i) & mask;
  m_z = (
            987654321 - i) & mask;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random(seed:number|null = null) {

  if(seed!== null) setSeed(seed);

  m_z = (
            36969 * (
            m_z & 65535) + (
                m_z >> 16)) & mask;
  m_w = (
            18000 * (
            m_w & 65535) + (
                m_w >> 16)) & mask;
  var result = (
                   (
                       m_z << 16) + (
                       m_w & 65535)) >>> 0;
  result /= 4294967296;
  return result;
}

export default random;

