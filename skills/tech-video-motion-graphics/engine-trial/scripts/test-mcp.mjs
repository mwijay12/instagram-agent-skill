import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport, getDefaultEnvironment } from '@modelcontextprotocol/sdk/client/stdio.js';

const ffmpegPath = process.env.FFMPEG_PATH || execFileSync(
  '/tmp/kvenv/bin/python',
  ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],
  { encoding: 'utf8' },
).trim();

const serverCli = fileURLToPath(new URL('../node_modules/ffmpeg-mcp/cli.js', import.meta.url));
const inputFile = fileURLToPath(new URL(
  '../../../../content-kit/code-video/samples/04-altraware-websites.mp4',
  import.meta.url,
));
const outputFile = '/tmp/mcp-websites-audio.mp3';

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverCli],
  env: { ...getDefaultEnvironment(), FFMPEG_PATH: ffmpegPath },
  cwd: fileURLToPath(new URL('..', import.meta.url)),
  stderr: 'pipe',
});

const client = new Client({ name: 'altraware-engine-trial', version: '1.0.0' }, { capabilities: {} });

try {
  await client.connect(transport);
  console.log('MCP server connected:', serverCli);
  const tools = await client.listTools();
  console.log('MCP tools:', tools.tools.map((t) => t.name).join(', '));

  const result = await client.callTool({
    name: 'extract_audio',
    arguments: { input_file: inputFile, output_file: outputFile },
  });
  console.log('MCP callTool result:', JSON.stringify(result.content));
  console.log('MCP output bytes:', statSync(outputFile).size);
  console.log('MCP_TRIAL_OK');
} catch (err) {
  console.error('MCP trial FAILED:', err.stack || err.message);
  process.exitCode = 1;
} finally {
  await client.close();
  await transport.close();
}
