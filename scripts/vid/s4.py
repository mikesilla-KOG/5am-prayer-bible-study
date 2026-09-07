import sys, math
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from vid.common import *

START = 52 * FPS
N = 18 * FPS

def main():
    for i in range(N):
        t=i/max(N-1,1); ts=i/FPS
        img=Image.new("RGB",(W,H)); gradient(img,(60,40,110),(120,80,160),0,400)
        d=ImageDraw.Draw(img)
        d.rectangle([0,400,W,H-BANNER_H], fill=(90,60,40))
        d.polygon([(400,400),(880,400),(1000,H-BANNER_H),(280,H-BANNER_H)], fill=GOLD)
        for px in (100,1180):
            d.rectangle([px-30,40,px+30,400], fill=(160,130,210), outline=GOLD, width=3)
            d.ellipse([px-40,20,px+40,70], fill=GOLD)
        for k in range(11):
            base_x=180+k*85
            gather=math.sin(min(t,1)*math.pi)*20
            x=base_x+(640-base_x)*0.08*gather/20
            y=360+int(math.sin(ts*2.5+k)*5)
            if t<0.35: arms="pray"; look="forward"
            elif t<0.65: arms="out"; look="right" if k<5 else "left"
            else: arms="up" if k!=8 else "wave"; look="forward"
            stick(d,x,y,0.9,ts*1.4+k*0.1,walk=(t<0.25),arms=arms,look=look,shirt=SHIRTS[k%len(SHIRTS)])
        bx=int(lerp(400,480,min(1,t/0.3))); mx=int(lerp(880,800,min(1,t/0.3)))
        stick(d,bx,280+int(math.sin(ts*2)*3),1.15,arms="down",shirt=(100,140,200))
        d.text((bx-50,430),"Barsabas", fill=WHITE, font=font(16,True))
        stick(d,mx,280+int(math.sin(ts*2+1)*3),1.15,ts,arms=("up" if t>0.7 else "down"),shirt=(220,160,40),outline=(90,60,160))
        d.text((mx-40,430),"Matthias", fill=(255,220,120), font=font(16,True))
        d.ellipse([580,300,700,360], fill=(180,150,100), outline=INK, width=3)
        if t<0.65:
            bounce=abs(math.sin(t*math.pi*6))*50*(1-t/0.65)
            lx=int(lerp(620,780,t/0.65)); ly=int(280-bounce)
            d.ellipse([lx,ly,lx+26,ly+26], fill=GOLD, outline=INK, width=2)
        else:
            d.ellipse([mx-10,250,mx+16,276], fill=GOLD, outline=INK, width=2)
            for k in range(6):
                ang=math.radians(k*60+ts*90)
                sx=mx+math.cos(ang)*50; sy=260+math.sin(ang)*30
                d.ellipse([sx-3,sy-3,sx+3,sy+3], fill=(255,220,120))
        if t<0.45:
            caption(img,"Acts 1:24","Thou, Lord, which knowest the hearts of all men, shew whether of these two thou hast chosen.")
        else:
            caption(img,"Acts 1:26","The lot fell upon Matthias; and he was numbered with the eleven apostles.")
        img.save(FRAMES/f"f_{START+i:06d}.png")
        if i%60==0: print("s4", i)
    print("s4 done", N)

if __name__=="__main__":
    main()
