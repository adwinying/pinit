import PinCard from "./PinCard"

type Props = {
  pins: {
    id: string
    title: string
    imageUrl: string
    username: string
    userImgUrl: string
    likedBy: string[]
  }[]
  className?: string
}
export default function PinsGrid({ pins, className = "" }: Props) {
  return (
    <ul
      className={`grid auto-rows-[1rem] grid-cols-1 items-start gap-5
        md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ${className}`}
    >
      {pins.map((pin) => (
        <PinCard
          key={pin.id}
          id={pin.id}
          pinImgUrl={pin.imageUrl}
          pinCaption={pin.title}
          username={pin.username}
          profileImgUrl={pin.userImgUrl}
          likedBy={pin.likedBy}
        />
      ))}
    </ul>
  )
}
