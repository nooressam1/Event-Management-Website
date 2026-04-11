import { useNavigate } from "react-router-dom";

const AddEventCard = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/events/create")}
      className="border-2 border-dashed border-LineBox rounded-xl flex flex-col items-center justify-center p-8 hover:bg-white/5 transition-colors cursor-pointer group h-full min-h-[350px]"
    >
      <div className="w-12 h-12 rounded-full bg-LineBox flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <span className="text-white text-2xl">+</span>
      </div>
      <h3 className="text-white font-semibold mb-1">Add New Event</h3>
      <p className="text-SecondOffWhiteText text-sm text-center">
        Launch a new experience for your audience
      </p>
    </div>
  );
};

export default AddEventCard;
