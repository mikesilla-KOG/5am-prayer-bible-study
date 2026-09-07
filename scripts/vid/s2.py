import sys, math
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from vid.common import *

START = 18 * FPS
N = 18 * FPS

def main():
    for i in range(N):
        t=i/max(N-1,1); ts=i/FPS
        img=Image.new("RGB",(W,H)); gradient(img,(50,100,200),(160,200,245),0,480)
        d=ImageDraw.Draw(img)
        d.ellipse([-80,400,650,640], fill=(80,150,90))
        d.ellipse([450,420,1380,660], fill=(70,160,90))
        d.rectangle([0,510,W,H-BANNER_H], fill=(50,130,70))
        jy=int(lerp(360,40,min(1.0,t*1.05))); jx=640
        for k in range(5):
            yy=jy+30+k*25
            if yy<H-BANNER_H-40: d.ellipse([jx-18+k,yy,jx+18-k,yy+20], fill=(255,230,120))
        halo(d,jx,jy,ts)
        stick(d,jx,jy,1.25,ts,arms="up",shirt=(255,255,245),outline=(90,60,160))
        cy=int(lerp(180,60,t))
        for ox,oy,sc in [(-90,0,1.2),(0,-25,1.4),(80,5,1.1)]:
            cloud(d,jx+ox,cy+oy,sc)
        for k,x in enumerate([220,320,420,520,780,880,980,1080]):
            bob=int(math.sin(ts*2.5+k)*4)
            stick(d,x,400+bob,1.05,ts*1.2+k*0.15,arms=("up" if k%2==0 else "wave"),look="up",shirt=SHIRTS[k%len(SHIRTS)])
        if t>0.55:
            at=(t-0.55)/0.45
            for ax,flip in ((560,False),(720,True)):
                ay=int(lerp(380,300,at))
                d.polygon([(ax,ay+20),(ax-30,ay+130),(ax+30,ay+130)], fill=WHITE, outline=GOLD, width=2)
                stick(d,ax,ay,1.0,arms="wave",shirt=(250,250,255),outline=GOLD)
        if t<0.55:
            caption(img,"Acts 1:9","While they beheld, he was taken up; and a cloud received him out of their sight.")
        else:
            caption(img,"Acts 1:11","This same Jesus... shall so come in like manner as ye have seen him go.")
        img.save(FRAMES/f"f_{START+i:06d}.png")
        if i%60==0: print("s2", i)
    print("s2 done", N)

if __name__=="__main__":
    main()
