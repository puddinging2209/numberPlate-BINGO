export default function haversine(a, b) {
    const R = 6371e3; // m
    const toRad = d => d * Math.PI / 180;

    const lon1 = toRad(a[0]);
    const lat1 = toRad(a[1]);
    const lon2 = toRad(b[0]);
    const lat2 = toRad(b[1]);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(h));
}