const CornerDots = () => {
  return (
    <div className="">
      <span className="absolute top-[-2px] left-[-2px] bg-white rounded-full h-[5px] w-[5px]" />
      <span className="absolute top-[-2px] right-[-2px] bg-white rounded-full h-[5px] w-[5px]" />
      <span className="absolute bottom-[-2px] left-[-2px] bg-white rounded-full h-[5px] w-[5px]" />
      <span className="absolute bottom-[-2px] right-[-2px] bg-white rounded-full h-[5px] w-[5px]" />
    </div>
  );
};

export default CornerDots;
