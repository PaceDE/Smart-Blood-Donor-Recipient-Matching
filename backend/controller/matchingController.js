// Convert degrees to radians
const toRad = (deg) => deg * (Math.PI / 180);

function vincenty(lat1, lon1, lat2, lon2) {

  const R = 6371000; // in meters
  lat1 = toRad(lat1);
  lon1 = toRad(lon1);
  lat2 = toRad(lat2);
  lon2 = toRad(lon2);

  return Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
  ) * R;
}


const getVincenty = (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.body;
  const distanceInMeters = vincenty(lat1, lon1, lat2, lon2);
  res.json({ distanceInMeters });
};

export { getVincenty };
