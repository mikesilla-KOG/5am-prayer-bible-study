import sys, math
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from vid.common import *

START = 36 * FPS
N = 16 * FPS

def main():
    for i in range(N):
        t=i/max(N-1,1); ts=i/FPS
        img=Image.new("RGB",(W,H)); gradient(img,(255,245,220),(255,235,200),0,420)
        d=ImageDraw.Draw(img)
        d.rectangle([0,420,W,H-BANNER_H], fill=(190,140,90))
        d.rectangle([0,400,W,420], fill=(140,90,50))
        for wx in (180,980):
            d.rectangle([wx,80,wx+140,260], fill=(140,200,255), outline=(140,90,50), width=6)
            sway=int(math.sin(ts*3+wx)*6)
            d.polygon([(wx+4,86),(wx+40+sway,86),(wx+30+sway,250),(wx+4,250)], fill=(160,130,210))
        d.ellipse([340,360,940,470], fill=(160,110,70), outline=(140,90,50), width=3)
        enter=min(1.0,t/0.4)
        for k in range(10):
            ang=math.radians(k*36-90)
            cx=640+math.cos(ang)*220; cy=340+math.sin(ang)*90
            x=lerp(-40-k*50,cx,enter*enter); y=lerp(380,cy,enter)
            if enter>=0.98:
                y=cy+math.sin(ts*2.2+k)*3
                arms="pray" if (int(ts*1.5)+k)%4!=0 else "up"
                look="up" if arms=="up" else "forward"; walk=False; phase=ts*0.8
            else:
                arms="down"; look="right"; walk=True; phase=ts*1.8+k*0.25
            stick(d,x,y,0.95,phase,walk=walk,arms=arms,look=look,shirt=SHIRTS[k%len(SHIRTS)])
        if t>0.6: flame(d,640,280+int(math.sin(ts*4)*5),ts,0.9)
        caption(img,"Acts 1:14","These all continued with one accord in prayer and supplication.")
        img.save(FRAMES/f"f_{START+i:06d}.png")
        if i%60==0: print("s3", i)
    print("s3 done", N)

if __name__=="__main__":
    main()
