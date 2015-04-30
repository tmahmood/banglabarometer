import os
import sys

def make_layout_file(fname):
	f = open('_layouts/%s.html' % fname, 'w')
	layout_text = """{%% include head.html %%}
{%% include navbar.html %%}
{%% include sidebar.html %%}
{%% include template.html %%}
{%% include %s.html %%}
{%% include scripts.html %%}
"""
	f.write(layout_text % fname)
	f.close()

def make_include_file(fname):
	f = open('_includes/%s.html' % fname, 'w')
	f.close()

def make_html_file(fname):
	f = open('%s.html' % fname, 'w')
	txt = """---
layout: %s
---
""" % fname
	f.write(txt)
	f.close()

def main():

	fname = sys.argv[1]
	if os.path.exists(fname):
		print ("FILE EXISTS, Please checl")
		return

	make_html_file(fname)
	make_layout_file(fname)
	make_include_file(fname)

	print( '<li><a href="%s.html">%s</a></li>' % (fname, fname) )

if __name__ == '__main__':
	main()

