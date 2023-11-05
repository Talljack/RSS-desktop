import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
const LeftPanel = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div className="flex w-80 flex-col items-center">
      <div className="pb-8">
        <Input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <PlusCircledIcon className="h-6 w-6 text-gray-400" />
      </div>
      <ScrollArea className="h-4/5"></ScrollArea>
    </div>
  )
}

export default LeftPanel
