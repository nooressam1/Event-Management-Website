import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import GuestViewPreview from "./GuestViewPreview";
import FieldLabel from "../primitives/FieldLabel";
import LabeledInput from "../../../shared/components/LabeledInput";

const MapUpdater = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 15);
  }, [coords, map]);
  return null;
};

const LocationPreview = ({ location }) => {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | found | notfound
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!location?.trim()) {
      setCoords(null);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setStatus("found");
        } else {
          setCoords(null);
          setStatus("notfound");
        }
      } catch {
        setCoords(null);
        setStatus("notfound");
      }
    }, 700);
    return () => clearTimeout(debounceRef.current);
  }, [location]);

  const shell = (children) => (
    <div className="mt-3 h-44 bg-MainBackground rounded-xl border border-LineBox flex items-center justify-center">
      {children}
    </div>
  );

  if (status === "idle")
    return shell(
      <span className="text-SecondOffWhiteText text-xs">
        Enter a location above to preview on map
      </span>
    );

  if (status === "loading")
    return shell(
      <span className="text-SecondOffWhiteText text-xs animate-pulse">
        Looking up location…
      </span>
    );

  if (status === "notfound")
    return shell(
      <div className="flex flex-col items-center gap-1">
        <MapPin size={18} className="text-SecondOffWhiteText" />
        <span className="text-SecondOffWhiteText text-xs">Location not found on map</span>
      </div>
    );

  return (
    <div
      className="mt-3 rounded-xl overflow-hidden border border-LineBox"
      style={{ height: "176px" }}
    >
      <MapContainer
        center={coords}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={coords} />
        <MapUpdater coords={coords} />
      </MapContainer>
    </div>
  );
};

const Step1EventDetails = ({ formData, updateField }) => {
  return (
  <div>
    <div className="flex flex-col lg:flex-row gap-8">
    <div className="flex-1 space-y-6 min-w-0">
      <LabeledInput
        label="Event Name"
        placeholder="Summer Networking Mixer"
        value={formData.title}
        onChange={(e) => updateField("title", e.target.value)}
      />

      <LabeledInput
        label="Short Description"
        placeholder="A Time to to dally Around"
        value={formData.shortDescription}
        onChange={(e) => updateField("shortDescription", e.target.value)}
      />

      <LabeledInput
        label="Cover Image URL"
        placeholder="https://..."
        value={formData.coverImage}
        onChange={(e) => updateField("coverImage", e.target.value)}
      />

      <div className="flex gap-4">
        <LabeledInput
          label="Select Date"
          type="date"
          icon={Calendar}
          inputClassName="[color-scheme:dark]"
          value={formData.date}
          onChange={(e) => updateField("date", e.target.value)}
        />
        <LabeledInput
          label="Start Time"
          type="time"
          icon={Clock}
          inputClassName="[color-scheme:dark]"
          value={formData.time}
          onChange={(e) => updateField("time", e.target.value)}
        />
      </div>

      <div>
        <LabeledInput
          label="Location"
          icon={MapPin}
          placeholder="The Rooftop Lounge, San Francisco"
          value={formData.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
        <LocationPreview location={formData.location} />
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea
          rows={5}
          className="w-full bg-NavigationBackground border border-LineBox rounded-xl px-4 py-3 text-white text-sm placeholder-SecondOffWhiteText focus:outline-none focus:border-MainBlue transition-colors resize-none"
          placeholder="Tell guests what to expect at your event..."
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>
    </div>

      <GuestViewPreview formData={formData} />
    </div>
  </div>
  );
};

export default Step1EventDetails;
