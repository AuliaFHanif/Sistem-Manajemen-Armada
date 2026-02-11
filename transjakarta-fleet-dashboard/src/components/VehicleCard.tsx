import type {
  MBTAVehicle,
  MBTAIncluded,
  MBTARouteIncluded,
  MBTATripIncluded,
  MBTAStopIncluded, // Ensure this is in your types
} from "../types/mbta";

interface VehicleCardProps {
  vehicle: MBTAVehicle;
  included: MBTAIncluded[];
}

const VehicleCard = ({ vehicle, included }: VehicleCardProps) => {
  const { attributes, relationships } = vehicle;

  // Cek apakah data sudah usang
  const minutesAgo = Math.floor(
    (new Date().getTime() - new Date(attributes.updated_at).getTime()) / 60000,
  );
  const isStale = minutesAgo >= 2;

  // Mencari informasi rute
  const routeId = relationships.route.data?.id;
  const routeInfo = included.find(
    (item): item is MBTARouteIncluded =>
      item.type === "route" && item.id === routeId,
  );

  // Mencari informasi trip untuk mendapatkan tujuan
  const tripId = relationships.trip.data?.id;
  const tripInfo = included.find(
    (item): item is MBTATripIncluded =>
      item.type === "trip" && item.id === tripId,
  );
  const destination = tripInfo?.attributes.headsign || "Tujuan Tidak Diketahui";

  // Mencari informasi lokasi saat ini (Nama Lokasi)
  const stopId = relationships.stop.data?.id;
  const stopInfo = included.find(
    (item): item is MBTAStopIncluded =>
      item.type === "stop" && item.id === stopId,
  );
  const stopName = stopInfo?.attributes.name || "Lokasi Tidak Diketahui";

  const routeColor = routeInfo ? `#${routeInfo.attributes.color}` : "#003366";
  const textColor = routeInfo
    ? `#${routeInfo.attributes.text_color}`
    : "#FFFFFF";

  // Formatter Status yang Ditingkatkan untuk menyertakan Nama Lokasi
  const formatStatus = (status: string | null | undefined) => {
    if (!status) return "Tidak Diketahui";
    const statusText = status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return `${statusText}: ${stopName}`;
  };

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-md border-l-8 overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col md:flex-row items-stretch ${
        isStale ? "ring-1 ring-amber-200" : ""
      }`}
      style={{ borderLeftColor: routeColor }}
    >
      {/* SECTION 1: ROUTE INFO - Removed truncate and fixed width */}
      <div className="p-6 flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shadow-sm"
            style={{ backgroundColor: routeColor, color: textColor }}
          >
            {routeInfo?.attributes.description || "Service"}
          </span>
        </div>
        <h2
          className="text-xl font-black leading-tight uppercase"
          style={{ color: routeColor }}
        >
          {routeInfo ? routeInfo.attributes.long_name : "Unknown Route"}
        </h2>
      </div>

      {/* SECTION 2: STATUS & DATA - Changed to 3 columns to fill space */}
      <div className="p-6 flex-3 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-center">
          <span className="text-[15px] font-bold text-gray-400 uppercase mb-1">
            Posisi Saat Ini
          </span>
          <span className="text-[15px] font-extrabold text-gray-800 leading-tight">
            {formatStatus(attributes.current_status)}
          </span>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-center">
          <span className="text-[15px] font-bold text-gray-400 uppercase mb-1">
            Tujuan Berikutnya
          </span>
          <span className="text-[15px] font-extrabold text-blue-800 leading-tight">
            {destination}
          </span>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-center">
          <span className="text-[15px] font-bold text-gray-400 uppercase mb-1">
            Tingkat Kepenuhan
          </span>
          <span className="text-sm font-extrabold text-blue-600 leading-tight">
            {attributes.occupancy_status
              ? attributes.occupancy_status.replace(/_/g, " ")
              : "TIDAK DIKETAHUI"}
          </span>
        </div>
      </div>

      {/* SECTION 3: VEHICLE LABEL & TIME */}
      <div className="p-6 flex-1 w-full bg-gray-50/30 md:bg-transparent flex flex-row md:flex-col justify-between items-center md:items-end gap-2">
        <div className="text-left md:text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            Label Kendaraan
          </span>
          <p className="text-2xl font-black text-[#003366] tracking-tight">
            {attributes.label}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${isStale ? "bg-amber-500" : "bg-green-500"}`}
            ></div>
            <span
              className={`text-[9px] font-bold uppercase tracking-widest ${isStale ? "text-amber-600" : "text-gray-400"}`}
            >
              {isStale ? `${minutesAgo}m Lalu` : "Live"}
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1">
            {new Date(attributes.updated_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
