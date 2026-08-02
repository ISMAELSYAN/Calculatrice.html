import zipfile, shutil, re, sys

def inject_watermark(src, dst):
    shutil.copy2(src, dst)
    WM = (
        '<w:p><w:pPr><w:jc w:val="center"/></w:pPr>'
        '<w:r><w:rPr><w:noProof/></w:rPr>'
        '<w:pict>'
        '<v:shape xmlns:v="urn:schemas-microsoft-com:vml" '
        'xmlns:o="urn:schemas-microsoft-com:office:office" '
        'id="wm1" type="#_x0000_t136" '
        'style="position:absolute;margin-left:0;margin-top:0;'
        'width:490pt;height:230pt;z-index:-251654144;'
        'mso-position-horizontal:center;mso-position-horizontal-relative:margin;'
        'mso-position-vertical:center;mso-position-vertical-relative:margin;'
        'rotation:-45;" '
        'o:allowincell="f" fillcolor="#D9D9D9" stroked="f">'
        '<v:fill on="t" type="solid" color="#D9D9D9"/>'
        '<v:textpath style="font-family:Arial;font-size:72pt;font-weight:bold" '
        'string="MEGASAVE MEDIAS" trim="t"/>'
        '</v:shape>'
        '</w:pict></w:r></w:p>'
    )
    with zipfile.ZipFile(dst, "r") as z:
        files = {n: z.read(n) for n in z.namelist()}
    touched = []
    for name in list(files):
        if re.match(r"word/header\d+\.xml", name):
            txt = files[name].decode("utf-8")
            if "wm1" not in txt:
                txt = txt.replace("</w:hdr>", WM + "</w:hdr>")
                files[name] = txt.encode("utf-8")
                touched.append(name)
    with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in files.items():
            z.writestr(name, data)
    print("watermark injecte dans:", touched)

inject_watermark(sys.argv[1], sys.argv[2])
