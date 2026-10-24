import importlib.util, json, hashlib, tempfile, unittest
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("renderer",ROOT/"brand-registry/render.py")
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
class RegistryRenderTests(unittest.TestCase):
    def test_pending_brand_fails_closed(self):
        with self.assertRaisesRegex(ValueError,"no approved"):
            module.approved_asset(ROOT,"uaethrive","primary")
    def test_valid_asset_is_composited_without_recreation(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); asset=root/"brand-registry/assets/test/logo.png";asset.parent.mkdir(parents=True)
            Image.new("RGBA",(24,12),(12,200,32,255)).save(asset)
            (root/"brand-registry").mkdir(exist_ok=True)
            data={"brands":{"test":{"status":"approved","assets":{"primary":{"path":"brand-registry/assets/test/logo.png","version":"v1","sha256":hashlib.sha256(asset.read_bytes()).hexdigest()}}}}}
            (root/"brand-registry/brands.json").write_text(json.dumps(data))
            bg=root/"bg.png";out=root/"out.png";Image.new("RGB",(200,100),"white").save(bg)
            module.render(root,"test","primary",bg,out,"bottom-right",8,.32)
            with Image.open(out) as result:
                self.assertEqual(result.convert("RGB").getpixel((175,80)),(12,200,32))
            asset.write_bytes(b"changed")
            with self.assertRaisesRegex(ValueError,"checksum mismatch"):
                module.approved_asset(root,"test","primary")
if __name__=="__main__":unittest.main()
