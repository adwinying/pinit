import PinCard from "./PinCard"

type Props = {
  pins: {
    id: string
    title: string
    imageUrl: string
    username: string
    userImgUrl: string
  }[]
  className?: string
}
export default function PinsGrid({ pins, className = "" }: Props) {
  return (
    <div
      className={`grid auto-rows-[1rem] grid-cols-pins items-start gap-5 ${className}`}
    >
      {pins.map((pin) => (
        <PinCard
          key={pin.id}
          pinImgUrl={pin.imageUrl}
          pinCaption={pin.title}
          username={pin.username}
          profileImgUrl={pin.userImgUrl}
        />
      ))}
    </div>
  )
}
