import React from 'react'
import { Button } from '../button'
import { Download } from 'lucide-react'


export default function LoadingButton() {
  return (
    <div className="flex animate-bounce items-center justify-center [&_svg]:size-6" >
    <Button
      size={"icon"}
      variant={"ghost"}
      aria-label='loading content'
      className="cursor-default bg-muted/20 text-blue-600 hover:bg-muted/20 hover:text-blue-500"
    >
      <Download />
    </Button>
    {/* eslint-disable-next-line react/jsx-no-literals */}
    <p className='sr-only'>loading content</p>
  </div>
  )
}