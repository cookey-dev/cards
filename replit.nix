{ pkgs }: {
	deps = [
		pkgs.onefetch
  pkgs.wget
  pkgs.vim
  pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}